const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 3,
      maxlength: 60,
      required: true,
    },
    body: {
      type: String,
      minlength: 3,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likes: [
      {
        username: String,
        createdAt: String,
      },
    ],
    comments: [
      {
        body: String,
        createdAt: String,
        updatedAt: String,
        username: String,
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
