const postsResolver = require("./posts");
const usersResolver = require("./users");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
  },
  Query: {
    ...postsResolver.Query,
  },
  Mutation: {
    ...postsResolver.Mutation,
    ...usersResolver.Mutation,
  },
};
