import { Router } from 'express';
import { loginFunction, registerFunction } from '../controllers/AdminAuthController.js';
const adminAuthRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Admin Auth
 *   description: Admin authentication APIs
 */

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