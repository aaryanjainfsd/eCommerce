import ClientModel from '../models/Client.model.js';

export async function createClient(req, res)
{
    try{
        const { name, businessName, websiteURL, email, phone } = req.body;

        const existing = await ClientModel.findOne({ email });

        if (existing) {
            res.status(409).json({ message: "Client with this email already exists" });
        }
        else
        {
            const newClient = await ClientModel.create({
                name,
                businessName,
                websiteURL,
                email,
                phone
            });
            res.status(201).json(newClient);
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });

    }
}

export async function getClients(req, res)
{

}