const express = require('express');
const router = express.Router();
const {
    castVote,
    getResults,
    getVotersByCandidate,
} = require('../controllers/voteController');
const { protect, checkRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/vote/{candidateId}:
 *   post:
 *     summary: Cast a vote for a candidate
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Vote cast successfully
 *       400:
 *         description: User already voted
 */
router.post('/:candidateId', protect, castVote);

/**
 * @swagger
 * /api/vote/results:
 *   get:
 *     summary: Get voting results
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Voting results
 */
router.get('/results', protect, getResults);

/**
 * @swagger
 * /api/vote/admin/voters/{candidateId}:
 *   get:
 *     summary: Get voters for a specific candidate (Admin only)
 *     tags: [Votes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: candidateId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of voters
 */
router.get(
    '/admin/voters/:candidateId',
    protect,
    checkRole('admin'),
    getVotersByCandidate
);

module.exports = router;