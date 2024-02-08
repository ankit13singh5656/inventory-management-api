

const jwt = require('jsonwebtoken');
const User = require('../model/userModel');
const Product=require("../model/productModel");

async function authMiddleware(req, res, next) {
  const token = req.header('Authorization');

  if (!token || !token.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Invalid or missing Authorization header.' });
  }

  const tokenWithoutBearer = token.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'user not found.' });
    }

    req.user = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };


//check if the user is an admin 
    if (user.role === 'admin') {
      // If the user has the role of "admin," proceed to the next middleware or route handler
      next();
    } else {
      // If the user is not authorized, return a 403 Forbidden response
      return res.status(403).json({ message: 'User not authorized for this operation.' });
    }
   /// next() yaha hiii pahle se hii per comment maine kaar diya hii
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = authMiddleware;

  