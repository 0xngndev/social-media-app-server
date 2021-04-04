const { gql } = require("apollo-server");

module.exports = gql`
  enum SortByType {
    NEWEST
    OLDEST
    VIEWS
    TOP
    HOT
  }

  type User {
    id: ID!
    createdAt: String!
    token: String!
    username: String!
    email: String!
    followers: [Follower]!
    followerCount: Int!
    follows: [Follows]!
    posts: [ID]!
  }

  type Follower {
    id: ID!
    username: String!
  }

  type Follows {
    id: ID!
    username: String!
  }

  type Post {
    id: ID!
    body: String!
    title: String!
    comments: [Comment]!
    likes: [Like]!
    author: Author!
    commentCount: Int!
    likeCount: Int!
    createdAt: String!
    excerpt: String!
    views: Int!
    hot: Float!
  }

  type Author {
    id: ID!
    username: String!
  }

  type Comment {
    id: ID!
    createdAt: String!
    body: String
    username: String!
  }

  type Like {
    id: ID!
    createdAt: String!
    username: String!
  }

  type PaginationNextPrev {
    limit: Int!
    page: Int!
  }

  type PaginationResult {
    next: PaginationNextPrev
    previous: PaginationNextPrev
    posts: [Post]!
  }

  input RegisterInput {
    username: String!
    email: String!
    password: String!
  }

  type Query {
    getPost(postId: ID!): Post
    getPosts: [Post]
    getPaginatedPosts(
      sortBy: SortByType!
      page: Int!
      limit: Int!
    ): PaginationResult!
    getUsers: [User]
    getUser(token: String!): User
    getUserById(userId: ID!): User
    getUserByUsername(username: String!): User
    getPostByFollows: [Post]
  }

  type Mutation {
    register(registerInput: RegisterInput): User!
    login(username: String!, password: String!): User!
    createPost(body: String!, title: String!): Post!
    updatePost(postId: ID!, body: String!, title: String!): Post!
    deletePost(postId: ID!): String!
    createComment(postId: ID!, body: String!): Post!
    updateComment(postId: ID!, body: String!, commentId: ID!): Post!
    deleteComment(postId: ID!, commentId: ID!): Post!
    likePost(postId: ID!): Post!
    followUser(userId: ID!): User!
  }

  type Subscription {
    newPost: Post!
  }
`;
