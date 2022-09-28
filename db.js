import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/movie', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error!'));
db.once('open', function () {
  console.log('MongoDB Connected successfully!');
});

export default db;
