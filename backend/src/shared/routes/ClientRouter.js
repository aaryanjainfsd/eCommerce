import { Router } from "express";
import { createClient, createClientWithCredentials, getAllClients } from "../controllers/ClientController.js";

const clientRouter = Router();

// Define your client routes here
clientRouter.post("/addClient", createClient);
clientRouter.post("/addClientWithCredentials", createClientWithCredentials);
clientRouter.get("/getAllClients", getAllClients);


export default clientRouter;
