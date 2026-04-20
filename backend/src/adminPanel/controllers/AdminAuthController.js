import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { isValidObjectId } from "mongoose";
import AdminAuthModel from '../models/AdminAuth.model.js';
import ClientModel from '../../shared/models/Client.model.js';
import { normalizeBusinessIdentifier } from '../../shared/utils/normalizeBusinessIdentifier.js';


export async function registerFunction(req, res) {
    try {
        console.log("Received registration request with body:", req.body);
        const { username, password, client_id } = req.body;
        const futureSampleId = `sample_${Date.now()}`;
        const normalizedUsername = normalizeBusinessIdentifier(username);

        if (!normalizedUsername || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }

        if (!client_id) {
            return res.status(400).json({ message: "client_id is required" });
        }

        if (!isValidObjectId(client_id)) {
            return res.status(400).json({ message: "Invalid client_id" });
        }

        const clientExists = await ClientModel.findById(client_id);
        if (!clientExists) {
            return res.status(404).json({ message: "Client not found for given client_id" });
        }

        const existing = await AdminAuthModel.findOne({ "data.username": normalizedUsername });
        if (existing) {
            return res.status(409).json({ message: "Username already registered" });
        } else {
            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newAdmin = await AdminAuthModel.create({
                foreignKeys: {
                    client_id: client_id,
                    future_sample_id: futureSampleId
                },
                data: {
                    username: normalizedUsername,
                    password: hashedPassword
                }
            });

            res.status(201).json({
                message: "User registered successfully",
                admin: newAdmin
            });
        }
    }
    catch (error) {
        console.log("Some error came". error);
        res.status(500).json({
            message: "Admin registration failed",
            error: error.message
        });
    }
}

export async function loginFunction(req, res) {
    try {
        const { username, password } = req.body;
        const normalizedUsername = normalizeBusinessIdentifier(username);
        const user = await AdminAuthModel.findOne({ "data.username": normalizedUsername })
        .populate({
            path: "foreignKeys.client_id",
            select: "clientName businessName websiteURL email phone status category createdAt updatedAt"
        });

        if (!user) {
            return res.status(404).json({ message: "Invalid username or password" });
        }
        
        console.log("Login attempt for username:", user.data.username);
        const matched = await bcrypt.compare(password, user.data.password);
        if (!matched) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        // -------------------------
        // CREATE JWT TOKEN
        // -------------------------
        const token = jwt.sign(
            {
                id: user._id,
                username: user.data.username,
                role: "admin"
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // -------------------------
        // STORE TOKEN IN COOKIE
        // -------------------------
        res.cookie("AdminLoginToken", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const clientData = user.foreignKeys.client_id || null;

        return res.status(200).json({
            message: "Admin login successful",
            user: {
                username: user.data.username,
                client_id: clientData
            }
        });
    }
    catch (error) {
        console.log("Some error came");
        res.status(500).json({
            message: "Admin login failed",
            error: error.message
        });
    }
}

/**
 * Verify if a username exists in the admin system
 * Used for real-time validation on the login page
 * Returns user info without password if username is found
 * This allows the frontend to show "Hello [username], verified" message
 */
export async function verifyUsernameFunction(req, res) {
    try {
        // Extract username from request body
        const { username } = req.body;
        const normalizedUsername = normalizeBusinessIdentifier(username);

        // Validate that username is provided
        if (!normalizedUsername) {
            return res.status(400).json({ message: "Username is required" });
        }

        // Search for user with matching username in database
        const user = await AdminAuthModel.findOne({ "data.username": normalizedUsername });

        // If user not found, return 404 error
        if (!user) {
            return res.status(404).json({ message: "Username not found" });
        }

        // If user found, return user info without password for security
        return res.status(200).json({
            message: "Username verified",
            user: {
                id: user._id,
                username: user.data.username,
                role: "admin"
            }
        });
    }
    catch (error) {
        console.log("Error during username verification:", error);
        res.status(500).json({
            message: "Username verification failed",
            error: error.message
        });
    }
}
