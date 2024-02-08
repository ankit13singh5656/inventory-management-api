
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName:{
    type:String,
    required:true,
  },
  lastName:{
    type:String,
    required:true,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'admin',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  age:{
    type: Number,
    required:true
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  isVerified: {
    type: Boolean,
    default: false,
  },
  verificationToken: String,
});

const User = mongoose.model('User', UserSchema);

module.exports = User;












