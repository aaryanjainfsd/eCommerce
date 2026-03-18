import { Router } from "express";
import { createClient, getClients } from "../controllers/ClientController.js";

const clientRouter = Router();

// Define your client routes here
clientRouter.post("/addClient", createClient);
clientRouter.get("/getClients", getClients);


export default clientRouter;
