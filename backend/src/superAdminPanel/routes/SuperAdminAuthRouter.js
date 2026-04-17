import { Router } from 'express';
import { loginFunction, registerFunction, logoutFunction } from '../controllers/SuperAdminAuthController.js';

const superAdminAuthRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Super Admin Auth
 *   description: Super admin authentication APIs
 */

/**
 * @swagger
 * /superAdmin/auth/login:
 *   post:
 *     summary: Login super admin
 *     tags: ['Super Admin Auth']
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
superAdminAuthRouter.post('/login', loginFunction);

/**
 * @swagger
 * /superAdmin/auth/register:
 *   post:
 *     summary: Register super admin
 *     tags: ['Super Admin Auth']
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
 *         description: Super admin created successfully
 */
superAdminAuthRouter.post('/register', registerFunction);

/**
 * @swagger
 * /superAdmin/auth/logout:
 *   post:
 *     summary: Logout super admin
 *     tags: ['Super Admin Auth']
 *     responses:
 *       200:
 *         description: Logout successful
 */
superAdminAuthRouter.post('/logout', logoutFunction);

export default superAdminAuthRouter;