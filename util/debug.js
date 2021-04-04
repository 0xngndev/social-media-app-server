getPostByFollows: async (_, __, context) => {
    const loggedUser = checkAuth(context);

    try {
      const user = await User.findById(loggedUser.id);
      if (!user) {
        throw new Error("Check user is logged in");
      }
      const followingIds = user.follows.map((follow) => follow.username);
      const users = await User.find({
        username: { $in: followingIds },
      });
      const usersPosts = users.map((user) => user.posts);
      const postsArray = usersPosts.flatMap((x) => x);
      const posts = await Post.find({ _id: { $in: postsArray } }).populate(
        "author",
        "username"
      );

     

      return posts;
    } catch (err) {
      throw new UserInputError(err);
    }
  },