const { merge } = require("lodash");
const { gql } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const { userTypeDefs, userResolvers } = require("./schema/users");

const mainDefs = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
`;

const resolvers = {
    
}

const schema = makeExecutableSchema({
  typeDefs: [mainDefs, userTypeDefs],
  resolvers: merge(resolvers, userResolvers)
});

exports.executableSchema = schema;
