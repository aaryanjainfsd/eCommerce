import {Schema, model } from "mongoose";

// SCHEMA   
const superAdminAuthSchema = new Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },   
        password: { type: String, required: true },
        role: { type: String, default: "Owner" }
    }, 
    { 
        timestamps: true,
        collection: "super_admin_auth_model"
    }
);

const SuperAdminAuthModel = model("SuperAdminAuthModel", superAdminAuthSchema);

export default SuperAdminAuthModel;