import mongoose from 'mongoose';

const token = mongoose.Schema({
  token: String,
});

export default mongoose.model('tokens', token);
