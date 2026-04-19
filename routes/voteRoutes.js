const express = require('express');
const router = express.Router();
const {
    castVote,
    getResults,
    getVotersByCandidate,
} = require('../controllers/voteController');
const { protect, checkRole } = require('../middleware/auth');

router.post('/:candidateId', protect, castVote);
router.get('/results', protect, getResults);
router.get(
    '/admin/voters/:candidateId',
    protect,
    checkRole('admin'),
    getVotersByCandidate
);

module.exports = router;