import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const localDB = 'mongodb://localhost:27017/movie';

mongoose.connect(process.env.MONGODB_CONNECT, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

try {
  db.on('error', console.error.bind(console, 'MongoDB connection error!'));
  db.once('open', function () {
    console.log('MongoDB Connected successfully!');
  });
} catch (error) {
  console.log(error);
}

export default db;
