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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    author: {
      type: String,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
