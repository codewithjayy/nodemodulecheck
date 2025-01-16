import express from 'express';
import mongoose from 'mongoose';

import User from './models/User.js';

const PORT = 3000;
const app = express();

mongoose
  .connect('mongodb://localhost:27017/userProfile', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected Successfully...'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// EJS Setup
app.set('view engine', 'ejs');

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// POST Request handler to store a new user
app.post('/users', async (req, res) => {
  try {
    const { name, email, bio, age } = req.body;
    const user = new User({ name, email, bio, age });
    await user.save();
    res.status(201).json({ message: 'User Created Successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

// Server Switch on Prompt message....
app.listen(PORT, (req, res) => {
  console.log(`The server is up and running on Port Number : ${PORT}`);
});
