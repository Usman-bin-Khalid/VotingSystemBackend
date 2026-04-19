const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Get authenticated user's profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *       401:
 *         description: Not authorized
 */
router.get('/profile', protect, getProfile);

module.exports = router;