const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    fullName: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dwd3gdhpf/image/upload/v1741012862/F8_Education/users/r4le9elower1u3fihj5g.avif",
    },
    password: { type: String },
    role: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
