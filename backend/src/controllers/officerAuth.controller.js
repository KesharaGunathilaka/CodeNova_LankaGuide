import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Officer from "../models/officer.js";
import RefreshToken from "../services/RefreshToken.js";
import { newJTI, signAccessToken, signRefreshToken } from "../utils/generateTokens.js";

const COOKIE_SECURE = String(process.env.COOKIE_SECURE) === "true";
const isProd = process.env.NODE_ENV === "production";

function setAuthCookies(res, accessToken, refreshToken, refreshMaxAgeMs) {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: COOKIE_SECURE || isProd,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: COOKIE_SECURE || isProd,
    sameSite: "lax",
    maxAge: refreshMaxAgeMs,
    path: "/api/auth/officer", // only officer refresh/logout endpoints
  });
}

// Officer login
export const loginOfficer = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email and password are required" });

    const officer = await Officer.findOne({ email });
    if (!officer) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Generate tokens
    const jti = newJTI();
    const accessToken = signAccessToken(officer, "officer");
    const refreshToken = signRefreshToken(officer, jti, "officer");

    // Decode refresh for expiry
    const refreshExpires = jwt.decode(refreshToken).exp * 1000;
    const refreshMaxAgeMs = refreshExpires - Date.now();

    // Store hashed refresh token
    const tokenHash = await bcrypt.hash(refreshToken, 10);
    await RefreshToken.create({
      user: officer._id,
      jti,
      tokenHash,
      expiresAt: new Date(refreshExpires),
    });

    setAuthCookies(res, accessToken, refreshToken, refreshMaxAgeMs);

    res.json({ officer: { id: officer._id, email: officer.email }, accessToken, refreshToken });
  } catch (error) {
    next(error);
  }
};

// Officer logout
export const logoutOfficer = async (req, res, next) => {
  try {
    const incoming = req.cookies?.refreshToken || req.body?.refreshToken;
    if (incoming) {
      try {
        const decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET);
        await RefreshToken.updateMany(
          { user: decoded.sub, revoked: false },
          { $set: { revoked: true } }
        );
      } catch (e) {
        // ignore
      }
    }

    res.clearCookie("refreshToken", { path: "/api/auth/officer" });
    res.clearCookie("accessToken");
    res.json({ message: "Officer logged out successfully" });
  } catch (error) {
    next(error);
  }
};
