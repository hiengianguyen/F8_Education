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
        "https://res.cloudinary.com/dwd3gdhpf/image/upload/v1740319980/F8_Education/dr9e0bxhmn9wjc40ddrf.webp",
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
