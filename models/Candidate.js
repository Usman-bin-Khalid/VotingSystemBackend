const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    votedAt: {
        type: Date,
        default: Date.now,
    },
});

const candidateSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Candidate name is required'],
        },
        party: {
            type: String,
            required: [true, 'Party name is required'],
            unique: true,
        },
        age: {
            type: Number,
            required: [true, 'Candidate age is required'],
            min: [25, 'Candidate must be at least 25 years old'],
        },
        votes: [voteSchema],
        voteCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Candidate', candidateSchema);