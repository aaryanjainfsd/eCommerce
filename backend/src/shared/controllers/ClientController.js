import ClientModel from '../models/Client.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import AdminAuthModel from '../../adminPanel/models/AdminAuth.model.js';

export async function createClient(req, res)
{
    try {
        const { clientName, businessName, websiteURL, email, phone, status, category } = req.body;

        if (!clientName || !businessName || !email || !phone) {
            return res.status(400).json({ message: "Missing required client fields" });
        }

        const existing = await ClientModel.findOne({ email });

        if (existing) {
            return res.status(409).json({ message: "Client with this email already exists" });
        } else {
            const newClient = await ClientModel.create({
                clientName,
                businessName,
                websiteURL,
                email,
                phone,
                status: status,
                category: category
            });

            res.status(201).json(newClient);
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function getAllClients(req, res)
{
    try {
        const clients = await ClientModel.find().sort({ createdAt: -1 });
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

