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
      type: mongoose.Types.ObjectId,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
