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
    console.log('User created successfully : ', user);
    res.status(201).json({ message: 'User Created Successfully', user });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find(); // Fetch all users from the database
    console.log('Users fetched successfully : ', users);
    res.status(200).json({ message: 'Users fetched successfully', users });
  } catch (error) {
    res.status(400).json({ message: 'Error fetching users', error });
  }
});
//patch request using id *********************************************************************************
// app.patch('/users/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { name, email, bio, age } = req.body;
//     const user = await User.findByIdAndUpdate(id,{ name, email, bio, age },{ new: true });

//     if (!user) {return res.status(404).json({ message: 'User not found' });
// }

//     console.log('User updated successfully : ', user);
//     res.status(200).json({ message: 'User updated successfully', user });
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating user', error });
//   }
// });

//patch request using the any unique id like here i give the email id****************************************************
app.patch('/users/:email', async (req, res) => {
  try {
    const email = req.params.email;
    const { name, bio, age } = req.body; 
    const user = await User.findOneAndUpdate({ email },{ name, bio, age }, { new: true });

    if (!user) {return res.status(404).json({ message: 'User not found' });}

    console.log('User updated successfully:', user);
    res.status(200).json({ message: 'User partially updated successfully', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(400).json({ message: 'Error updating user', error });
  }
});

  //put request
  // app.put('/users/:email', async (req, res) => {
  //   try {
  //     const email = req.params.email;
  //     const { name, bio, eamil, age } = req.body;
  
  //     console.log('Updating user with email:', email);  
  //     console.log('Updated data:', { name, bio,email, age });
  
  //     const updatedData = { name, bio,email, age };
  
  //     const updatedUser = await User.findOneAndUpdate({ email }, updatedData, {
  //       new: true, // Return the updated user
  //       runValidators: true, // Validate against the schema
  //     });
  
  //     if (!updatedUser) {
  //       console.log('User with given Roll No not found');
  //       return res
  //         .status(404)
  //         .json({ message: 'User with given Roll No not found' });
  //     } else {
  //       console.log('User updated successfully:', updatedUser);
  //       return res.json({
  //         message: 'User updated successfully!',
  //         user: updatedUser,
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error updating user:', error);
  //     return res.status(400).json({ message: 'Error updating user', error });
  //   }
  // });

  app.put('/users/:email', async (req, res) => {
    try {
      const currentEmail = req.params.email;
      const { name, bio, email, age } = req.body;
  
      const user = await User.findOne({ email: currentEmail });
      console.log('Updating user with email:', email);  
      console.log('Updated data:', { name, bio,email, age });
      if (!user) {
        return res.status(404).json({ message: 'User with the given email not found' , user});
      }
  
      user.name = name || user.name;
      user.bio = bio || user.bio;
      user.email = email || user.email;
      user.age = age || user.age;
  
      
    const updatedUser = await user.save();

    console.log('User updated successfully:', updatedUser);
  
      return res.json({message: 'User updated successfully!',user: updatedUser,});
    } catch (error) {
      return res.status(400).json({ message: 'Error updating user', error });
    }
  });


  //delete option
  app.delete('/users/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const deletedUser = await User.findOneAndDelete({ email });
      if (!deletedUser) {return res.status(404).json({ message: 'User with the given email not found' });}
      console.log('User deleted successfully:', deletedUser);
      return res.json({message: 'User deleted successfully!',user: deletedUser,});
    } catch (error) {
      return res.status(400).json({ message: 'Error deleting user', error });
    }
  }); 
  
      
// Server Switch on Prompt message....
app.listen(PORT, (req, res) => {
  console.log(`The server is up and running on Port Number : ${PORT}`);
});