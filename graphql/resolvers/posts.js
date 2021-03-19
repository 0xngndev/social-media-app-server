const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const checkAuth = require("../../util/validators");

module.exports = {
  Query: {
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new Error("That post does not exist.");
        }
        return post;
      } catch (error) {
        throw new Error("Post not founc");
      }
    },
    getPosts: async () => {
      try {
        const posts = await Post.find({}).sort({ createdAt: -1 });
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
  Mutation: {
    createPost: async (_, { body, title }, context) => {
      const user = checkAuth(context);
      if (body.trim() === "") {
        throw new Error("You must provide a body");
      }
      if (title.trim() === "") {
        throw new Error("You must provide a title");
      }

      const newPost = await new Post({
        body,
        title,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save();

      context.pubsub.publish("NEW_POST", {
        newPost: post,
      });

      return post;
    },
    updatePost: async (_, { postId, body, title }) => {
      const user = checkAuth(context);
      if (!user) {
        throw AuthenticationError("You must be logged in to create a post");
      }
      if (!body) {
        throw UserInputError("You must provide a body");
      }

      if (!title) {
        throw UserInputError("You must provide a title");
      }
      if (!postId) {
        throw UserInputError("You must provide the post's ID");
      }
      const updatedPost = await Post.updateOne(
        { _id: postId },
        {
          $set: {
            body,
            title,
          },
        }
      );
      return updatedPost;
    },
    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (error) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString(),
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError("Post not found");
    },
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_POST"),
    },
  },
};
