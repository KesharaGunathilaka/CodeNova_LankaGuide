import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export function signAccessToken(user) {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const expiresIn = process.env.ACCESS_TOKEN_EXPIRES;
  const payload = { sub: String(user._id), email: user.email, type: 'access' };
  return jwt.sign(payload, secret, { expiresIn });
}

export function signRefreshToken(user, jti) {
  const secret = process.env.REFRESH_TOKEN_SECRET;
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRES;
  const payload = { sub: String(user._id), email: user.email, type: 'refresh', jti };
  return jwt.sign(payload, secret, { expiresIn });
}

export function newJTI() {
  return crypto.randomUUID();
}