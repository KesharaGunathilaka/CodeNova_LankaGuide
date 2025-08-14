import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    nic: { 
        type: String,
        unique: true,
        required: true,
        validate: {
            validator: function(v) {
                // Check for either 12 digits or 9 digits followed by V/v
                return /^(\d{12}|\d{9}[Vv])$/.test(v);
            },
            message: props => `${props.value} is not a valid NIC number! NIC should be either 12 digits or 9 digits followed by 'V'`
        }
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      match: /.+@.+\..+/, 
    },
    passwordHash: { type: String, required: true },
    contactNumber: { type: String, required: true },
  },
  { timestamps: true }
);

userSchema.methods.toJSONSafe = function () {
  return {
    id: this._id,
    nic: this.nic,
    email: this.email,
    contactNumber: this.contactNumber,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model('User', userSchema);