const { ApolloServer, AuthenticationError } = require('apollo-server');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// Import typeDefs and resolvers
const filePath = path.join(__dirname, 'typeDefs.gql');
const typeDefs = fs.readFileSync(filePath, 'utf-8');
const resolvers = require('./resolvers');

// Import env vars & mongoose models
require('dotenv').config({ path: 'variables.env' });
const User = require('./models/User');
const Post = require('./models/Post');

// connect to mlab db
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => { console.log('db connected'); })
  .catch(err => { console.error(err); });

// verify jwt 
const getUser = async token => {
  if (token) {
   try {
    return await jwt.verify(token, process.env.SECRET);
   } catch (error) {
     throw new AuthenticationError('Your session has ended. Please sign in again.');
   }
  }
}

// Create Apollo/Graphql server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers['authorization'];
    return { User, Post, currentUser: await getUser(token) };
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
