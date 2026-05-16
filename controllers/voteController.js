const Candidate = require('../models/Candidate');
const User = require('../models/User');



// @desc    Cast a vote for a candidate
// @route   POST /api/vote/:candidateId
// @access  Private
const castVote = async (req, res) => {
    const userId = req.user._id;
    const { candidateId } = req.params;

    // Check if user already voted
    const user = await User.findById(userId);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    if (user.isVoted) {
        res.status(400);
        throw new Error('You have already voted');
    }

    // Find candidate
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
        res.status(404);
        throw new Error('Candidate not found');
    }

    // Perform atomic update on candidate
    const updatedCandidate = await Candidate.findByIdAndUpdate(
        candidateId,
        {
            $push: { votes: { user: userId } },
            $inc: { voteCount: 1 },
        },
        { new: true }
    );

    if (!updatedCandidate) {
        res.status(500);
        throw new Error('Vote could not be recorded');
    }

    // Update user voting status
    user.isVoted = true;
    user.votedForCandidate = candidateId;
    await user.save();

    res.status(200).json({
        message: 'Vote cast successfully',
        candidate: {
            name: updatedCandidate.name,
            party: updatedCandidate.party,
        },
    });
};

// @desc    Get election results (vote counts)
// @route   GET /api/results
// @access  Private
const getResults = async (req, res) => {
    const results = await Candidate.find({})
        .select('name party voteCount')
        .sort({ voteCount: -1 });

    res.json(results);
};

// @desc    Get voters list for a candidate (Admin only)
// @route   GET /api/admin/voters/:candidateId
// @access  Private/Admin
const getVotersByCandidate = async (req, res) => {
    const { candidateId } = req.params;

    const candidate = await Candidate.findById(candidateId).populate({
        path: 'votes.user',
        select: 'name profileImage cnic',
    });

    if (!candidate) {
        res.status(404);
        throw new Error('Candidate not found');
    }

    const voters = candidate.votes.map((vote) => ({
        name: vote.user.name,
        profileImage: vote.user.profileImage,
        cnic: vote.user.cnic,
        votedAt: vote.votedAt,
        voters
    }));

    res.json({
        candidateName: candidate.name,
        party: candidate.party,
        totalVotes: candidate.voteCount,
        voters,
    });
};





module.exports = { castVote, getResults, getVotersByCandidate };