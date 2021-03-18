const { gql } = require("apollo-server-core");

module.exports = gql`
  type User {
    id: ID!
    username: String!
    email: String!
  }

  type Query {
    getUser(id: ID!): User!
  }
`;
