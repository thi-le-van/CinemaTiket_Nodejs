import mongoose from 'mongoose';

const user = mongoose.Schema(
  {
    name: String,
    userName: String,
    password: String,
  },
  { timestamps: true }
);

export default mongoose.model('user', user);
