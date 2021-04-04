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
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    email: {
      type: String,
      required: true,
      minlength: 9,
      unique: true,
    },
    followers: [
      {
        username: String,
        createdAt: String,
      },
    ],
    follows: [
      {
        username: String,
        createdAt: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);
