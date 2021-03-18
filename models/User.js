const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 15,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    email: {
      type: String,
      required: true,
      minlength: 9,
      unique: true,
    },
  },
  { timestamps: true }
);

module.exports = model("User", userSchema);
