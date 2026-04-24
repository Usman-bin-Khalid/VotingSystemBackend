const Candidate = require('../models/Candidate');


// @desc    Create a new candidate (Admin only)
// @route   POST /api/candidates
// @access  Private/Admin
const createCandidate = async (req, res) => {
    const { name, party, age } = req.body;

    const candidateExists = await Candidate.findOne({ party });
    if (candidateExists) {
        res.status(400);
        throw new Error('Candidate with this party name already exists');
    }

    const candidate = await Candidate.create({
        name,
        party,
        age,
    });


    if (candidate) {
        res.status(201).json(candidate);
    } else {
        res.status(400);
        throw new Error('Invalid candidate data');
    }
};

// @desc    Get all candidates
// @route   GET /api/candidates
// @access  Private
const getCandidates = async (req, res) => {
    const candidates = await Candidate.find({}).select('name party age voteCount');
    res.json(candidates);
};

module.exports = { createCandidate, getCandidates };