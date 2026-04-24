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
const signup = async (req, res, next) => {
    try {
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
            return res.status(400).json({ message: 'User with this email, username or CNIC already exists' });
        }

        let profileImageUrl = '';
        const uploadFile = req.file;

        if (uploadFile) {
            try {
                const result = await uploadToCloudinary(uploadFile.buffer);
                profileImageUrl = result.secure_url;
            } catch (error) {
                console.error('Cloudinary Upload Error:', error);
                return res.status(500).json({
                    message: 'Image upload failed',
                    error: error
                });
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
            profileimage: profileImageUrl,
        });

        if (user) {
            res.status(201).json({
                user,
                // _id: user._id,
                // name: user.name,
                // email: user.email,
                // role: user.role,
                // cnic: user.cnic,
                // profileimage: user.profileimage,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        next(error);
    }
};


// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const { cnic, password } = req.body;

        const user = await User.findOne({ cnic });
        if (!user) {
            return res.status(401).json({ message: 'Invalid CNIC or password' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid CNIC or password' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            age: user.age,
            email: user.email,
            role: user.role,
            mobile: user.mobile,
            address: user.address,
            salary: user.salary,
            cnic: user.cnic,
            isVoted: user.isVoted,
            votedForCandidate: user.votedForCandidate,
            profileimage: user.profileimage,
            token: generateToken(user._id),
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { signup, login };