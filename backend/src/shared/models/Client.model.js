import { Schema, model } from "mongoose";

// SCHEMA
const clientSchema = new Schema(
    {
        clientName      : { type: String, required: true },
        businessName    : { type: String, required: true },
        websiteURL      : { type: String },
        email           : { type: String, required: true, unique: true },
        phone           : { type: String, required: true },
        status          : { type: String, default: "Active" },
        role            : { type: String, default: "client" }
    },
    {
        timestamps: true
    }
);

const ClientModel = model("client", clientSchema);
export default ClientModel;
