import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import { isValidObjectId } from "mongoose";
import AdminAuthModel from '../models/AdminAuth.model.js';
import ClientModel from '../../shared/models/Client.model.js';
import productRouter from "../../storeFront/routes/ProductRouter.js";


export async function registerFunction(req, res) {
    try {
        console.log("Received registration request with body:", req.body);
        const { username, password, client_id } = req.body;
        const futureSampleId = `sample_${Date.now()}`;

        if (!username || !password) {
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

        const existing = await AdminAuthModel.findOne({ "data.username": username });
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
                    username: username,
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
        const user = await AdminAuthModel.findOne({ "data.username": username });
        if (!user) {
            return res.status(404).json({ message: "Invalid username or password" });
        }
        else {
            const matched = await bcrypt.compare(password, user.data.password);
            if (!matched) {
                return res.status(401).json({ message: "Incorrect password" });
            }
            else {
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

                return res.status(200).json({
                    message: "Admin login successful",
                    user: user
                });
            }
        }
    }
    catch (error) {
        console.log("Some error came");
        res.status(500).json({
            message: "Admin login failed",
            error: error.message
        });
    }
}
