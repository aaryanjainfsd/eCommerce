import { Router } from "express";
import { createClient, getAllClients, softDeleteClient } from "../controllers/ClientController.js";

const clientRouter = Router();

/**
 * @swagger
 * tags:
 *   name: Clients
 *   description: Shared client management APIs used by admin and super admin
 */

/**
 * @swagger
 * /shared/clients/addClient:
 *   post:
 *     summary: Create a new shared client
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [clientName, businessName, email, phone]
 *             properties:
 *               clientName:
 *                 type: string
 *               businessName:
 *                 type: string
 *               websiteURL:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               status:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       201:
 *         description: Client created successfully
 *       409:
 *         description: Client with email already exists
 */
clientRouter.post("/addClient", createClient);

/**
 * @swagger
 * /shared/clients/getAllClients:
 *   get:
 *     summary: Get all active shared clients
 *     tags: [Clients]
 *     responses:
 *       200:
 *         description: Clients fetched successfully
 */
clientRouter.get("/getAllClients", getAllClients);

/**
 * @swagger
 * /shared/clients/removeClient/{clientId}:
 *   patch:
 *     summary: Soft delete shared client by id
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client removed successfully
 *       404:
 *         description: Client not found
 */
clientRouter.patch("/removeClient/:clientId", softDeleteClient);

export default clientRouter;
