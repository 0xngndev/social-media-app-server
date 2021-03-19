const { gql } = require("apollo-server");

module.exports = gql`
  type User {
    id: ID!
    createdAt: String!
    token: String!
    username: String!
    email: String!
  }

  type Post {
    id: ID!
    body: String!
    title: String!
    comments: [Comment]!
    likes: [Like]!
    author: String!
    commentCount: Int!
    likeCount: Int!
    createdAt: String!
  }

  type Comment {
    id: ID!
    createdAt: String!
    body: String
    author: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  type Query {
    getPost(postId: ID!): Post
    getPosts: [Post]
  }

  type Mutation {
    register(registeInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!, title: String!): Post!
    updatePost(postId: ID!, body: String!, title: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    updateComment(postId: ID!, body: String!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
  }

  type Subscription {
    newPost: Post!
  }
`;
