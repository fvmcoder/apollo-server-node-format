const { ApolloServer } = require('apollo-server-express');
const {executableSchema} = require('../graphql/index');

module.exports = (app)=>{
    const server = new ApolloServer({
        schema : executableSchema
      });
    server.applyMiddleware({ app });
}