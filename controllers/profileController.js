const User = require('../models/User');

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

module.exports = { getProfile };