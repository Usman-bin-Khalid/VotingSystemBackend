const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        age: {
            type: Number,
            required: [true, 'Age is required'],
            min: [18, 'You must be at least 18 years old'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        role: {
            type: String,
            enum: ['voter', 'admin'],
            default: 'voter',
        },
        isVoted: {
            type: Boolean,
            default: false,
        },
        mobile: {
            type: String,
            required: [true, 'Mobile number is required'],
        },
        address: {
            type: String,
            required: [true, 'Address is required'],
        },
        salary: {
            type: Number,
            required: [true, 'Salary is required'],
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
        },
        cnic: {
            type: String,
            required: [true, 'CNIC is required'],
            unique: true,
        },
        profileImage: {
            type: String,
            default: '',
        },
        votedForCandidate: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Candidate',
            default: null,
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);