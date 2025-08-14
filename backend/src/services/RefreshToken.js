import mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    jti: { type: String, required: true, index: true },
    tokenHash: { type: String, required: true },
    revoked: { type: Boolean, default: false },
    replacedByToken: { type: String },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('RefreshToken', refreshTokenSchema);