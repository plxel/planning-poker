const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema").default;
const resolvers = require("./resolvers").default;
const { User } = require("./db");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (connection) {
      // check connection for metadata
      return connection.context;
    } else {
      const token = req.headers.authorization || "";
      const user = await User.getByToken(token);
      return { user };
    }
  }
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
