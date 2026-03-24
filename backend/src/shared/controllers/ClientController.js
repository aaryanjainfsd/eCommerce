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
        // Aggregation pipeline starts from the `client` collection (ClientModel).
        // Think of this like SQL with multiple stages:
        // 1) join credential data
        // 2) flatten joined array
        // 3) choose what fields to return
        // 4) sort newest first
        const clients = await ClientModel.aggregate([
            {
                // $lookup = LEFT JOIN.
                // `from` must be the MongoDB collection name, not model name.
                // Here we match: client._id  <->  admin_auth_credentials.foreignKeys.client_id
                $lookup: {
                    from: "admin_auth_credentials",
                    localField: "_id",
                    foreignField: "foreignKeys.client_id",
                    as: "credentialData"
                }
            },
            {
                // $unwind converts array -> object for easier access.
                // preserveNullAndEmptyArrays keeps clients even when no credentials exist.
                $unwind: {
                    path: "$credentialData",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                // $project shapes the final object returned to frontend.
                // We keep needed client fields and expose username + hashed password.
                $project: {
                    clientName: 1,
                    businessName: 1,
                    websiteURL: 1,
                    email: 1,
                    phone: 1,
                    status: 1,
                    category: 1,
                    createdAt: 1,
                    username: "$credentialData.data.username",
                    hashedPassword: "$credentialData.data.password"
                }
            },
            {
                // Latest created clients first.
                $sort: { createdAt: -1 }
            }
        ]);

        // bcrypt hashes are one-way and salted.
        // So we CANNOT compare `phone === hash` directly.
        // We must use bcrypt.compare(plainText, hash).
        const enrichedClients = await Promise.all(
            clients.map(async (client) => {
                if (!client.hashedPassword) {
                    return {
                        ...client,
                        passwordDisplay: "-",
                        isPasswordSameAsPhone: false
                    };
                }

                const isPasswordSameAsPhone = await bcrypt.compare(
                    String(client.phone || ""),
                    client.hashedPassword
                );

                return {
                    ...client,
                    passwordDisplay: isPasswordSameAsPhone ? client.phone : "Password has been changed",
                    isPasswordSameAsPhone
                };
            })
        );

        // Remove hashed password from response for safety.
        const sanitizedClients = enrichedClients.map(({ hashedPassword, ...clientData }) => clientData);

        res.status(200).json(sanitizedClients);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function createClientWithCredentials(req, res)
{
    const session = await mongoose.startSession();

    try {
        const {
            clientName,
            businessName,
            websiteURL,
            email,
            phone,
            status,
            category,
            username,
            password
        } = req.body;

        if (!clientName || !businessName || !email || !phone || !username || !password) {
            return res.status(400).json({ message: "Missing required fields for client or credentials" });
        }

        const existingClient = await ClientModel.findOne({ email });
        if (existingClient) {
            return res.status(409).json({ message: "Client with this email already exists" });
        }

        const existingUsername = await AdminAuthModel.findOne({ "data.username": username });
        if (existingUsername) {
            return res.status(409).json({ message: "Username already registered" });
        }

        let createdClient;
        let createdCredentials;

        await session.withTransaction(async () => {
            const clients = await ClientModel.create(
                [{
                    clientName,
                    businessName,
                    websiteURL,
                    email,
                    phone,
                    status: status || "Active",
                    category
                }],
                { session }
            );

            createdClient = clients[0];

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const credentials = await AdminAuthModel.create(
                [{
                    foreignKeys: {
                        client_id: createdClient._id,
                        future_sample_id: `sample_${Date.now()}`
                    },
                    data: {
                        username,
                        password: hashedPassword
                    }
                }],
                { session }
            );

            createdCredentials = credentials[0];
        });

        return res.status(201).json({
            message: "Client and credentials created successfully",
            client: createdClient,
            credentialsId: createdCredentials._id
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create client and credentials",
            error: error.message
        });
    } finally {
        await session.endSession();
    }
}