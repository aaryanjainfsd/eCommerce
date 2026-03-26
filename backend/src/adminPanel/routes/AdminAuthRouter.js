import { Router } from 'express';
import { loginFunction, registerFunction, verifyUsernameFunction } from '../controllers/AdminAuthController.js';
const adminAuthRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Admin Auth
 *   description: Admin authentication APIs
 */

/**
 * @swagger
 * /admin/auth/verify-username:
 *   post:
 *     summary: Verify if username exists in the system
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Username verified successfully
 *       404:
 *         description: Username not found
 */
adminAuthRouter.post('/verify-username', verifyUsernameFunction);

/**
 * @swagger
 * /admin/auth/login:
 *   post:
 *     summary: Login admin
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
adminAuthRouter.post('/login', loginFunction);

/**
 * @swagger
 * /admin/auth/register:
 *   post:
 *     summary: Register admin
 *     tags: [Admin Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, password]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
adminAuthRouter.post('/register', registerFunction);


export default adminAuthRouter;