import { Schema, model } from "mongoose";

// SCHEMA
const clientSchema = new Schema(
    {
        name            : { type: String, required: true },
        businessName    : { type: String, required: true },
        websiteURL      : { type: String },
        email           : { type: String, required: true, unique: true },
        phone           : { type:Number, required: true },
        status          : { type: String, default: "Active" }
    },
    {
        timestamps: true,
        collection: "client_model"
    }
);

const ClientModel = model("ClientModel", clientSchema);

export default ClientModel;
