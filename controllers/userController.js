const crypto = require('crypto');
const User = require('../model/userModel');

const mongoose=require("mongoose");
const { sendVerificationEmail,sendOTPEmail } = require('../config/nodemailer');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


async function signup(req, res) {
  const { username, email, password,firstName, lastName, age } = req.body;

  const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  try {
    const newUser = await User.create({

      username,
      email,
      password: await bcrypt.hash(password, 10),
      firstName,
      lastName,
      age,
      isVerified: false,
      verificationToken,
    });
    


    const verificationLink = `http://localhost:${process.env.PORT}/user/verify/${newUser._id}/${verificationToken}`;
    sendVerificationEmail(newUser.email, verificationLink);

    res.status(201).json({ message: 'User registered successfully. Check your email for verification.' });
  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      return res.status(400).json({ message: 'user is already registered.' });
    }

    res.status(500).json({ message: 'Something went wrong.' });
    
  }
}

async function verifyUser(req, res) {
  const { id, token } = req.params;

  try {
    const user = await User.findById(id);

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return res.status(401).json({ message: 'Token expired. Request a new verification email.' });
        }
        return res.status(401).json({ message: 'Invalid token.' });
      }

      user.isVerified = true;
      await user.save();

      res.status(200).json({ message: 'User verified successfully.' });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

//login process


const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid Email.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    if (!user.isVerified) {
      return res.status(401).json({ message: 'Account not verified. Check your email for verification.' });
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {expiresIn: "365d"});

    return res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

//update users

const updateUser = async (req, res) => {
  try {
    const id = req.params.id.trim();
  
    const {username, email, password, firstName, lastName, age } = req.body;

    const updatedUser =await User.findByIdAndUpdate(
      id,
      { username,  firstName, lastName, age },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'admin not found' });
    }

    res.json({message: "admin updated successfuly"});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


//delete user
const deleteUser = async (req, res) => {
  let id = req.params.id;

  // Remove leading/trailing whitespaces and newline characters
  id = id.trim();

  try {
    console.log('Deleting user with ID:', id);

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(202).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

//get all registered users
const getAllUsers = async (req, res) => {
  try {
      const AllUsers = await User.find({},{password: 0, __v: 0});
      res.status(200).json(AllUsers);
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Something went wrong' });
  }
};


//forgot password

const  forgotPassword= async(req, res) => {
  const { email } = req.body;

  try {
    
    const user = await User.findOne({ email:email.toLowerCase() });
      console.log('User found:', user);


    if (!user) {
      console.log(user);
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // Token expires in 1 hour

     user.resetPasswordToken = resetToken;
     user.resetPasswordExpires = expires;
    

    await user.save();

    const resetLink = `http://localhost:${process.env.PORT}/reset-password/${resetToken}`;
     
      
    
    // Send email with the resetLink
    sendOTPEmail(email, resetLink);

    res.status(200).json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}

async function resetPassword(req, res) {
  const { resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired reset token' });
    }

    // Update user password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}




      
module.exports = { signup, verifyUser, login, updateUser, deleteUser, getAllUsers, forgotPassword,resetPassword};



