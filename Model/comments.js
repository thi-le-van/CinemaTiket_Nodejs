import mongoose from 'mongoose';

const commentsSchema = new mongoose.Schema(
  {
    movieId: String,
    username: String,
    userId: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model('comments', commentsSchema);
