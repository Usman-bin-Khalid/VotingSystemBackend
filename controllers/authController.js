const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');

// Helper function to upload buffer to Cloudinary
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: 'voting-system/profiles' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    const {
        name,
        age,
        email,
        role,
        mobile,
        address,
        salary,
        username,
        password,
        cnic,
    } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { username }, { cnic }] });
    if (userExists) {
        res.status(400);
        throw new Error('User with this email, username or CNIC already exists');
    }

    let profileImageUrl = '';
    if (req.file) {
        try {
            const result = await uploadToCloudinary(req.file.buffer);
            profileImageUrl = result.secure_url;
        } catch (error) {
            res.status(500);
            throw new Error('Image upload failed');
        }
    }

    const user = await User.create({
        name,
        age,
        email,
        role: role || 'voter',
        mobile,
        address,
        salary,
        username,
        password,
        cnic,
        profileImage: profileImageUrl,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            cnic: user.cnic,
            profileImage: user.profileImage,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    const { cnic, password } = req.body;

    const user = await User.findOne({ cnic });
    if (!user) {
        res.status(401);
        throw new Error('Invalid CNIC or password');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid CNIC or password');
    }

    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cnic: user.cnic,
        profileImage: user.profileImage,
        token: generateToken(user._id),
    });
};

module.exports = { signup, login };