const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/authController');
const upload = require('../middleware/upload');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - age
 *               - email
 *               - mobile
 *               - address
 *               - salary
 *               - username
 *               - password
 *               - cnic
 *             properties:
 *               name:
 *                 type: string
 *               age:
 *                 type: number
 *               email:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [voter, admin]
 *               mobile:
 *                 type: string
 *               address:
 *                 type: string
 *               salary:
 *                 type: number
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               cnic:
 *                 type: string
 *               profileimage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists or invalid data
 */
router.post('/signup', upload.single('profileimage'), signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cnic
 *               - password
 *             properties:
 *               cnic:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', login);

module.exports = router;