const { ApolloServer, PubSub } = require("apollo-server");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
require("dotenv").config();
const connectToDB = require("./db");
require("dotenv").config();

const pubsub = new PubSub();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub }),
});

connectToDB();

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
