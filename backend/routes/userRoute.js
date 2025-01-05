import express from 'express';
import { loginUser, registerUser, createReview, getProductReviews, getUserDetails, updateProfile, forgotPassword, verifyOtpAndPassword } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';


const userRouter = express.Router();

// Auth routes
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Review routes
userRouter.post('/create_review', authMiddleware, createReview);
userRouter.get('/reviews/:id', getProductReviews);

//profile routes
userRouter.get('/get_user/:id', getUserDetails)
userRouter.put('/update_profile/:id', authMiddleware, updateProfile);

// forgot password
userRouter.post('/forgot_password', forgotPassword)

userRouter.post('/verify_otp', verifyOtpAndPassword)


export default userRouter;
