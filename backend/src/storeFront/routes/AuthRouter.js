import { Router } from 'express';
import { registerUser, loginUser, getSingleUser, getAllUsers, deleteUser, updateUser} from '../controllers/AuthController.js';

const authRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Storefront Auth
 *   description: Storefront user authentication and user management
 */

// Redirecting to controller functions
/**
 * @swagger
 * /storefront/auth/get:
 *   get:
 *     summary: Get all storefront users
 *     tags: ['Storefront Auth']
 *     responses:
 *       200:
 *         description: Users fetched successfully
 */
authRouter.get('/get', getAllUsers);

/**
 * @swagger
 * /storefront/auth/login:
 *   post:
 *     summary: Login storefront user
 *     tags: ['Storefront Auth']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Incorrect password
 *       404:
 *         description: User not found
 */
authRouter.post('/login', loginUser);

/**
 * @swagger
 * /storefront/auth/get/{id}:
 *   get:
 *     summary: Get storefront user by id
 *     tags: ['Storefront Auth']
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       404:
 *         description: User not found
 */
authRouter.get('/get/:id', getSingleUser);

/**
 * @swagger
 * /storefront/auth/update/{id}:
 *   put:
 *     summary: Update storefront user by id
 *     tags: ['Storefront Auth']
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
authRouter.put('/update/:id', updateUser);

/**
 * @swagger
 * /storefront/auth/register:
 *   post:
 *     summary: Register storefront user
 *     tags: ['Storefront Auth']
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, username, email, phone, password]
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               avatar:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already registered
 */
authRouter.post('/register', registerUser);

/**
 * @swagger
 * /storefront/auth/delete/{id}:
 *   delete:
 *     summary: Delete storefront user by id
 *     tags: ['Storefront Auth']
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
authRouter.delete('/delete/:id', deleteUser);
export default authRouter;

