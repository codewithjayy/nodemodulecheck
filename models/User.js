// User.js (ES Modules)
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  bio: { type: String, default: '' },
  age: { type: Number, default: 0 },
});

export default mongoose.model('User', userSchema);
