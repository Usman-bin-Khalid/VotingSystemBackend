const express = require('express');
const router = express.Router();
const {
    createCandidate,
    getCandidates,
} = require('../controllers/candidateController');
const { protect, checkRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/candidates:
 *   post:
 *     summary: Create a new candidate (Admin only)
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - party
 *               - age
 *             properties:
 *               name:
 *                 type: string
 *               party:
 *                 type: string
 *               age:
 *                 type: number
 *     responses:
 *       201:
 *         description: Candidate created successfully
 *       403:
 *         description: Not authorized (Admin only)
 *   get:
 *     summary: Get all candidates
 *     tags: [Candidates]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of candidates
 */
router
    .route('/')
    .post(protect, checkRole('admin'), createCandidate)
    .get(protect, getCandidates);

module.exports = router;