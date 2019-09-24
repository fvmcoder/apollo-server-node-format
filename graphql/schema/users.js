const { gql, ValidationError, AuthenticationError } = require("apollo-server-express");

const typeDefs = gql`
  extend type Query {
    activeUser: User
    Users: [User]
  }
  type User {
    _id: ID
    username: String!
    email: String
    password: String
    displayName: String
    banned: String
  }

  extend type Mutation {
    login(inputs: loginInput!): loginResponse
    register(inputs: registerInput): regisResponse
    updateUser(displayName: String!): User!
  }

  input loginInput {
    email: String!
    password: String!
  }
  input registerInput {
    username: String!
    email: String!
    password: String!
  }

  type loginResponse {
    message: String!
    token: String!
  }
  type regisResponse {
    message: String!
    user: User!
  }
`;
const resolvers = {
  Query: {
    Users: async (root, {}, ctx, info) => {
      return ctx.models.Users.find({});
    },
    activeUser: async (root, args, ctx, info) => {
      const { Users } = ctx.models;
      return await Users.findUserById(ctx.currentUser._id);
    }
  },
  Mutation: {
    login: async (root, args, ctx, info) => {
      const { Users } = ctx.models;
      const { inputs } = args;

      const user = await Users.loginAuthinticate(inputs);
      if (!user) throw new ValidationError("Invalid username and password");

      const token = await user.generateJwtToken();
      if (!token) throw new AuthenticationError();

      return { message: "Succefully Login", token: token };
    },
    register: async (root, args, ctx, info) => {
      const { Users } = ctx.models;
      const { inputs } = args;

      //check email
      let user = await Users.findUserByEmail(inputs.email);
      if (user) throw new ValidationError("email is already taken");

      //check username
      //should be used dataloader cache
      user = await Users.findUserByName(inputs.username);
      if (user) throw new ValidationError("username is already taken");

      //create User
      user = await Users.createNewUser(inputs);
      if (!user) return { message: "Account Created Failed" };

      //200 Ok
      return { message: "Successfully Created Account", user: user };
    },
    updateUser: async (root, { displayName }, ctx, info) => {
      const { username } = ctx.currentUser;
      const { Users } = ctx.models;

      let isUpdated = await Users.findUserAndUpdate(username, displayName);
      if (!isUpdated)
        return { message: "Updated Failed", error: "cancel.updated" };

      return isUpdated;
    }
  }
};

exports.userTypeDefs = typeDefs;
exports.userResolvers = resolvers;
