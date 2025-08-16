import mongoose from "mongoose";

const officerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: /.+@.+\..+/,
    },
    password: { type: String, required: true },
    name: { type: String, required: true }, 
    role: { type: String, default: "officer" },
  },
  { timestamps: true }
);

officerSchema.methods.toJSONSafe = function () {
  return {
    id: this._id,
    email: this.email,
    name: this.name,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model("Officer", officerSchema);
