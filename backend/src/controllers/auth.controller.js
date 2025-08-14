import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import RefreshToken from '../services/RefreshToken.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { newJTI, signAccessToken, signRefreshToken } from '../utils/generateTokens.js';

const COOKIE_SECURE = String(process.env.COOKIE_SECURE) === 'true';
const isProd = process.env.NODE_ENV === 'production';

function setAuthCookies(res, accessToken, refreshToken, refreshMaxAgeMs) {
  // Access token (optional cookie; you can rely on Authorization header instead)
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: COOKIE_SECURE || isProd,
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000,
  });

  // Refresh token cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: COOKIE_SECURE || isProd,
    sameSite: 'lax',
    maxAge: refreshMaxAgeMs,
    path: '/api/auth', // refresh/logout endpoints
  });
}

export const register = asyncHandler(async (req, res) => {
  const { nic, email, password, contactNumber } = req.body;
  if (!nic || !email || !password || !contactNumber) {
    return res.status(400).json({ message: 'nic, email, password, contactNumber are required' });
  }

  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: 'Email already registered' });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);
  const user = await User.create({ nic, email, passwordHash, contactNumber });

  // Create tokens
  const jti = newJTI();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, jti);

  // Persist hashed refresh token
  const refreshExpires = jwt.decode(refreshToken).exp * 1000; // ms
  const refreshMaxAgeMs = refreshExpires - Date.now();

  const tokenHash = await bcrypt.hash(refreshToken, 10);
  await RefreshToken.create({
    user: user._id,
    jti,
    tokenHash,
    expiresAt: new Date(refreshExpires),
  });

  setAuthCookies(res, accessToken, refreshToken, refreshMaxAgeMs);

  return res.status(201).json({
    user: user.toJSONSafe(),
    accessToken,
    refreshToken,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'email and password are required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

  const jti = newJTI();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, jti);

  const refreshExpires = jwt.decode(refreshToken).exp * 1000;
  const refreshMaxAgeMs = refreshExpires - Date.now();

  const tokenHash = await bcrypt.hash(refreshToken, 10);
  await RefreshToken.create({
    user: user._id,
    jti,
    tokenHash,
    expiresAt: new Date(refreshExpires),
  });

  setAuthCookies(res, accessToken, refreshToken, refreshMaxAgeMs);

  res.json({
    user: user.toJSONSafe(),
    accessToken,
    refreshToken,
  });
});

export const refresh = asyncHandler(async (req, res) => {
  // Prefer cookie; fall back to body for testing
  const incoming = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!incoming) return res.status(401).json({ message: 'Missing refresh token' });

  let decoded;
  try {
    decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET);
    if (decoded.type !== 'refresh') throw new Error('Invalid token type');
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired refresh token' });
  }

  const tokenDoc = await RefreshToken.findOne({ user: decoded.sub, jti: decoded.jti });
  if (!tokenDoc || tokenDoc.revoked) {
    // Token reuse / rotation attack detected: revoke all user's tokens
    await RefreshToken.updateMany({ user: decoded.sub, revoked: false }, { $set: { revoked: true } });
    return res.status(401).json({ message: 'Refresh token no longer valid' });
  }

  // Compare incoming token with stored hash
  const match = await bcrypt.compare(incoming, tokenDoc.tokenHash);
  if (!match) {
    // Possible theft; revoke all for safety
    await RefreshToken.updateMany({ user: decoded.sub, revoked: false }, { $set: { revoked: true } });
    return res.status(401).json({ message: 'Refresh token mismatch' });
  }

  // Rotate: revoke current and issue new pair
  tokenDoc.revoked = true;
  await tokenDoc.save();

  const user = await (await import('../models/user.js')).default.findById(decoded.sub);
  if (!user) return res.status(401).json({ message: 'User not found' });

  const newJti = newJTI();
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user, newJti);

  const refreshExpires = jwt.decode(refreshToken).exp * 1000;
  const refreshMaxAgeMs = refreshExpires - Date.now();

  const tokenHash = await bcrypt.hash(refreshToken, 10);
  await RefreshToken.create({
    user: user._id,
    jti: newJti,
    tokenHash,
    expiresAt: new Date(refreshExpires),
    replacedByToken: tokenDoc.jti,
  });

  setAuthCookies(res, accessToken, refreshToken, refreshMaxAgeMs);

  res.json({ accessToken, refreshToken });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ user: user.toJSONSafe() });
});

export const logout = asyncHandler(async (req, res) => {
  const incoming = req.cookies?.refreshToken || req.body?.refreshToken;
  if (incoming) {
    try {
      const decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET);
      await RefreshToken.updateMany({ user: decoded.sub, revoked: false }, { $set: { revoked: true } });
    } catch (e) {
      // ignore
    }
  }

  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.clearCookie('accessToken');
  res.json({ message: 'Logged out' });
});