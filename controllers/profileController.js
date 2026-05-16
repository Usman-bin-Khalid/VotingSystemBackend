const User = require('../models/User');
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

// @desc    Get user profile with voting info
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password')
        .populate('votedForCandidate', 'name party');

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    res.json(user);
};



// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { name, username, age, mobile, address, salary } = req.body;


        // Update fields if provided
        if (name) user.name = name;
        if (username) user.username = username;
        if (age) user.age = age;
        if (mobile) user.mobile = mobile;
        if (address) user.address = address;
        if (salary) user.salary = salary;

        // Handle profile image update
        const uploadFile = req.file;
        if (uploadFile) {
            try {
                const result = await uploadToCloudinary(uploadFile.buffer);
                user.profileimage = result.secure_url;
            } catch (error) {
                console.error('Cloudinary Upload Error:', error);
                return res.status(500).json({
                    message: 'Image upload failed',
                    error: error.message
                });
            }
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            age: updatedUser.age,
            mobile: updatedUser.mobile,
            address: updatedUser.address,
            salary: updatedUser.salary,
            profileimage: updatedUser.profileimage,
            role: updatedUser.role,
            isVoted: updatedUser.isVoted,
            votedForCandidate: updatedUser.votedForCandidate,
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Username already exists' });
        }
        next(error);
    }
};

module.exports = { getProfile, updateProfile };
