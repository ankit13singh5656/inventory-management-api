const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../Middleware/authMiddleware');
const router = express.Router();

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/verify/:id/:token', userController.verifyUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete("/:id", authMiddleware, userController.deleteUser);
router.get("/getAllUsers", authMiddleware, userController.getAllUsers);
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
module.exports = router;




