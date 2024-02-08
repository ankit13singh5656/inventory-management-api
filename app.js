
// app.js
const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const productRoutes=require("./routes/productRoutes");
const dotenv = require('dotenv');
//const authMiddleware = require('./Middleware/authMiddleware');


dotenv.config();

const app = express();

app.use(express.json());
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/user', userRoutes);
app.use("/product",productRoutes);

// app.use('/user', authMiddleware.authenticate, userRoutes);
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});















































// const express = require('express');
// const mongoose = require('mongoose');
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use(express.json());

// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const User = mongoose.model('User', {
//   username: String,
//   email: String,
//   password: String,
//   isVerified: Boolean,
//   verificationToken: String,
// });

// app.post('/user/signup', async (req, res) => {
//   const { username, email, password } = req.body;

//   // Generate verification token with expiration time (e.g., 24 hours)
//   const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });

//   try {
//     // Save user data with verification token
//     const newUser = await User.create({
//       username,
//       email,
//       password: await bcrypt.hash(password, 10),
//       isVerified: false,
//       verificationToken,
//     });

//     // Send verification email
//     const verificationLink = `http://localhost:${PORT}/user/verify/${newUser._id}/${verificationToken}`;
//     sendVerificationEmail(newUser.email, verificationLink);

//     res.status(201).json({ message: 'User registered successfully. Check your email for verification.' });
//   } catch (error) {
//     console.error(error);

//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Email address is already registered.' });
//     }

//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// });

// app.get('/user/verify/:id/:token', async (req, res) => {
//   const { id, token } = req.params;

//   try {
//     // Find the user by ID
//     const user = await User.findById(id);

//     // Verify the token
//     jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
//       if (err) {
//         if (err.name === 'TokenExpiredError') {
//           return res.status(401).json({ message: 'Token expired. Request a new verification email.' });
//         }
//         return res.status(401).json({ message: 'Invalid token.' });
//       }

//       // Mark the user as verified
//       user.isVerified = true;
//       await user.save();

//       res.status(200).json({ message: 'User verified successfully.' });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Something went wrong.' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });

// // Nodemailer setup
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD,
//   },
// });

// function sendVerificationEmail(email, link) {
//   transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Account Verification',
//     html: `<p>Click <a href="${link}">here</a> to verify your account.</p>`,
//   }, (error, info) => {
//     if (error) {
//       console.error(error);
//     } else {
//       console.log('Email sent: ' + info.response);
//     }
//   });
// }
