const postsResolver = require("./posts");
const usersResolver = require("./users");
const commentsResolver = require("./comments");

module.exports = {
  Post: {
    likeCount: (parent) => parent.likes.length,
    commentCount: (parent) => parent.comments.length,
    excerpt: (parent) => parent.body.split(" ").slice(0, 21).join(" "),
  },
  User: {
    followerCount: (parent) => parent.followers.length,
  },
  Query: {
    ...postsResolver.Query,
    ...usersResolver.Query,
  },
  Mutation: {
    ...postsResolver.Mutation,
    ...usersResolver.Mutation,
    ...commentsResolver.Mutation,
  },
};
