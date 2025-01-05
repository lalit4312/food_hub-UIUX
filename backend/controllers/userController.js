import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';
import Review from '../models/reviewModel.js';
import foodModel from "../models/foodModel.js";
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import nodemailer from 'nodemailer';

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

// Get the directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'profiles');
try {
    await fs.access(uploadDir);
} catch (error) {
    await fs.mkdir(uploadDir, { recursive: true });
}

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
}).single('profileImage');


const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = createToken(user._id);
        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    try {
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please enter a valid email' });
        }

        if (password.length < 8) {
            return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            phone,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const createReview = async (req, res) => {
    const { productId, rating, comment } = req.body;
    console.log(productId, rating, comment)

    if (!productId || !rating || !comment) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    try {
        // Check if product exists
        const product = await foodModel.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Check if user has already reviewed this product
        const existingReview = await Review.findOne({
            productId,
            userId: req.user.id
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: "You have already reviewed this product"
            });
        }

        const review = new Review({
            productId,
            userId: req.user.id,
            rating,
            comment: comment.trim()
        });

        await review.save();

        // Update product ratings
        const allProductReviews = await Review.find({ productId });
        const averageRating = allProductReviews.reduce((acc, item) => acc + item.rating, 0) / allProductReviews.length;

        product.numberOfReviews = allProductReviews.length;
        product.averageRating = Number(averageRating.toFixed(1));
        await product.save();

        // Populate user details in the response
        const populatedReview = await Review.findById(review._id).populate('userId', 'name');

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            data: populatedReview
        });
    } catch (error) {
        console.error('Review creation error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getProductReviews = async (req, res) => {
    const { id: productId } = req.params;

    try {
        const reviews = await Review.find({ productId })
            .populate('userId', 'name')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            message: "Reviews fetched successfully",
            reviews
        });
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// profile section necessary arrangements
const getUserDetails = async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await userModel.findOne({ _id: userId }).exec();

        res.status(201).json({
            success: true,
            message: "User Data Fetched!",
            userDetails: user,
        });

    } catch (e) {
        console.log(e);
        res.json({
            success: false,
            message: "Server Error!",
        });
    }
};

const deleteFile = async (filePath) => {
    try {
        if (!filePath) return;
        const fullPath = path.join(__dirname, '..', 'public', filePath.replace('/images/profiles/', 'profiles/'));
        await fs.unlink(fullPath);
        console.log('Successfully deleted old profile image:', fullPath);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            console.error('Error deleting file:', error);
        }
    }
};


const updateProfile = async (req, res) => {
    return new Promise((resolve, reject) => {
        upload(req, res, async (err) => {
            try {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({
                        success: false,
                        message: `Upload error: ${err.message}`
                    });
                } else if (err) {
                    return res.status(400).json({
                        success: false,
                        message: err.message
                    });
                }

                const userId = req.params.id;

                // Get current user to get the old profile image
                const currentUser = await userModel.findById(userId);
                if (!currentUser) {
                    return res.status(404).json({
                        success: false,
                        message: "User not found"
                    });
                }

                const updateData = {
                    name: req.body.name,
                    email: req.body.email,
                    phone: req.body.phone
                };

                if (req.file) {
                    // Delete old profile image if it exists
                    if (currentUser.profileImage) {
                        await deleteFile(currentUser.profileImage);
                    }
                    updateData.profileImage = `/images/profiles/${req.file.filename}`;
                }

                const updatedUser = await userModel.findByIdAndUpdate(
                    userId,
                    updateData,
                    { new: true, select: '-password' }
                );

                res.status(200).json({
                    success: true,
                    message: "Profile updated successfully",
                    user: updatedUser
                });
                resolve();
            } catch (error) {
                console.error('Update profile error:', error);
                res.status(500).json({
                    success: false,
                    message: "Internal server error",
                    error: error.message
                });
                reject(error);
            }
        });
    });
};


// Forgot Password
const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Set OTP and expiry
        user.otpReset = otp;
        user.otpResetExpires = Date.now() + 3600000; // 1 hour expiry
        await user.save();

        // Send email
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'lakshya69056@gmail.com',
                pass: 'phqa mzxu clox jbzr'
            }
        });

        var mailOptions = {
            from: 'lakshya69056@gmail.com',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for password reset is: ${otp}`
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Error sending email' });
            } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: 'Password reset OTP sent' });
            }
        });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
};

// Verify OTP and Set New Password
const verifyOtpAndPassword = async (req, res) => {
    const { email, otp, password } = req.body;
    console.log(otp)

    if (!email || !otp || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const now = Date.now();
        const otpResetExpires = user.otpResetExpires.getTime();

        console.log(`Current Time (ms): ${now}`);
        console.log(`OTP Expiry Time (ms): ${otpResetExpires}`);
        console.log(`Stored OTP: ${user.otpReset}`);
        console.log(`Provided OTP: ${otp}`);

        if (user.otpReset != otp) {
            console.log('Provided OTP does not match stored OTP');
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (otpResetExpires < now) {
            console.log('OTP has expired');
            return res.status(400).json({ message: 'Expired OTP' });
        }

        const randomSalt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, randomSalt);
        user.otpReset = undefined;
        user.otpResetExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export {
    loginUser,
    registerUser,
    createReview,
    getProductReviews,
    getUserDetails,
    updateProfile,
    forgotPassword,
    verifyOtpAndPassword
};