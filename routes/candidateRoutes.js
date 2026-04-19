const express = require('express');
const router = express.Router();
const {
    createCandidate,
    getCandidates,
} = require('../controllers/candidateController');
const { protect, checkRole } = require('../middleware/auth');

router
    .route('/')
    .post(protect, checkRole('admin'), createCandidate)
    .get(protect, getCandidates);

module.exports = router;