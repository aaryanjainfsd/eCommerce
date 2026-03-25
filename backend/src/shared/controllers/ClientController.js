import ClientModel from '../models/Client.model.js';
import bcrypt from 'bcryptjs';


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
        const clients = await ClientModel.aggregate([
            {
                $match: {
                    status: { $nin: [0, "0"] }
                }
            },
            // Join client with credentials collection
            {
                $lookup: {
                    from: "admin_auth_credentials",
                    localField: "_id",
                    foreignField: "foreignKeys.client_id",
                    as: "credential"
                }
            },
            // Convert credential array to single object (if present)
            {
                $unwind: {
                    path: "$credential",
                    preserveNullAndEmptyArrays: true
                }
            },
            // Keep client fields + username/password
            {
                $project: {
                    clientName: 1,
                    businessName: 1,
                    websiteURL: 1,
                    email: 1,
                    phone: 1,
                    status: 1,
                    category: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    username: "$credential.data.username",
                    hashedPassword: "$credential.data.password"
                }
            },
            // Latest clients first
            {
                $sort: { createdAt: -1 }
            }
        ]);

        // Compare hashed password with phone number
        const processedClients = [];
        
        for (let client of clients) {
            let passwordStatus = "Password updated"; // Default message
            
            if (client.hashedPassword) {
                // Check if phone number matches the encrypted password
                const isMatch = await bcrypt.compare(client.phone, client.hashedPassword);
                
                // Update message if they match
                if (isMatch) {
                    passwordStatus = "Password was not changed";
                }
            }
            
            // Create new client object with password status
            const clientData = {
                ...client,
                password: passwordStatus
            };
            delete clientData.hashedPassword; // Remove the encrypted password
            
            // Add to results list
            processedClients.push(clientData);
        }

        // Another way of doing same as above using map and Promise.all, but it can be less efficient due to creating many promises: 
        // const processedClients = await Promise.all(
        //     clients.map(async (client) => {
        //         let passwordStatus = "Password updated";
                
        //         if (client.hashedPassword) {
        //             const isMatch = await bcrypt.compare(client.phone, client.hashedPassword);
        //             passwordStatus = isMatch ? "Password was not changed" : "Password updated";
        //         }
                
        //         return {
        //             ...client,
        //             password: passwordStatus,
        //             hashedPassword: undefined
        //         };
        //     })
        // );

        res.status(200).json(processedClients);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

export async function softDeleteClient(req, res)
{
    try {
        const { clientId } = req.params;

        if (!clientId) {
            return res.status(400).json({ message: "Client ID is required" });
        }

        const updatedClient = await ClientModel.findByIdAndUpdate(
            clientId,
            { status: 0 },
            { new: true }
        );

        if (!updatedClient) {
            return res.status(404).json({ message: "Client not found" });
        }

        return res.status(200).json({
            message: "Client removed successfully",
            client: updatedClient
        });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

