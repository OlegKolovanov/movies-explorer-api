require('dotenv').config();

const {
  PORT = 3000,
  JWT_SECRET = 'develop-secret',
  MONGO_URL = 'mongodb://localhost:27017/moviesdb',
} = process.env;

module.exports = {
  PORT,
  JWT_SECRET,
  MONGO_URL,
};
