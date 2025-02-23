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
        "https://res.cloudinary.com/dwd3gdhpf/image/upload/v1740316055/F8_Education/aojxixiqjkhsrgi3ye0h.webp",
    },
    password: { type: String },
    role: { type: String, default: "user" },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
