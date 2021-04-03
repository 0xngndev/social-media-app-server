const { AuthenticationError, UserInputError } = require("apollo-server");

const Post = require("../../models/Post");
const User = require("../../models/User");
const checkAuth = require("../../util/check-auth");
const paginate = require("../../util/paginate");

module.exports = {
  Query: {
    getPost: async (_, { postId }) => {
      try {
        const post = await Post.findById(postId).populate("author", "username");

        console.log(post);
        if (!post) {
          throw new Error("That post does not exist.");
        }
        post.views++;
        await post.save();
        return post;
      } catch (error) {
        throw new Error("Post not found");
      }
    },
    getPosts: async () => {
      try {
        const posts = await Post.find({})
          .sort({ createdAt: -1 })
          .populate("author", "username");
        return posts;
      } catch (error) {
        throw new Error(error);
      }
    },
    getPaginatedPosts: async (_, args) => {
      const { sortBy } = args;
      const page = Number(args.page);
      const limit = Number(args.limit);

      let sortDef;
      switch (sortBy) {
        case "TOP":
          sortDef = { likes: -1 };
          break;
        case "VIEWS":
          sortDef = { views: -1 };
          break;
        case "NEWEST":
          sortDef = { createdAt: -1 };
          break;
        case "OLDEST":
          sortDef = { createdAt: 1 };
          break;
        default:
          sortDef = { createdAt: -1 };
      }

      try {
        const postCount = await Post.find().countDocuments();
        const paginated = paginate(page, limit, postCount);
        const posts = await Post.find()
          .sort(sortDef)
          .limit(limit)
          .skip(paginated.start)
          .populate("author", "username");

        const paginatedPosts = {
          previous: paginated.results.previous,
          posts,
          next: paginated.results.next,
        };

        return paginatedPosts;
      } catch (err) {
        throw new UserInputError(err);
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
      console.log(user);

      try {
        const author = await User.findById(user.id);

        const newPost = await new Post({
          body,
          title,
          author: author._id,
          createdAt: new Date().toISOString(),
        });
        const savedPost = await newPost.save();
        const populatedPost = await savedPost
          .populate("author", "username")
          .execPopulate();

        author.posts.push(savedPost._id);
        await author.save();

        context.pubsub.publish("NEW_POST", {
          newPost: populatedPost,
        });

        return populatedPost;
      } catch (error) {
        throw new Error(error);
      }
    },
    updatePost: async (_, { postId, body, title }, context) => {
      const user = checkAuth(context);

      if (body.trim() === "") {
        throw new Error("You must provide a body");
      }
      if (title.trim() === "") {
        throw new Error("You must provide a title");
      }

      if (!postId) {
        throw UserInputError("You must provide the post's ID");
      }

      const updatedPostObj = {
        title,
        body,
        updatedAt: Date.now(),
      };

      try {
        const post = await Post.findById(postId);
        if (!post) {
          throw new UserInputError("That post does not exist");
        }

        if (user.id === post.author.toString()) {
          throw new AuthenticationError("Access is denied");
        }

        const updatedPost = await Post.findByIdAndUpdate(
          postId,
          updatedPostObj,
          { new: true }
        );

        return updatedPost;
      } catch (err) {
        throw new UserInputError(err);
      }
    },
    deletePost: async (_, { postId }, context) => {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        const loggedUser = await User.findById(user.id);

        if (!post) {
          throw new UserInputError("That post does not exist");
        }
        if (user.id === post.author.toString()) {
          loggedUser.posts = loggedUser.posts.filter(
            (p) => p.toString() !== postId
          );
          await loggedUser.save();
          await post.delete();
          return "Post deleted successfully";
        } else {
          throw new AuthenticationError("Action not allowed");
        }
      } catch (err) {
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
