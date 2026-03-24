import { Router } from "express";
import { createClient, getAllClients } from "../controllers/ClientController.js";

const clientRouter = Router();

// Define your client routes here
clientRouter.post("/addClient", createClient);
clientRouter.get("/getAllClients", getAllClients);


export default clientRouter;
