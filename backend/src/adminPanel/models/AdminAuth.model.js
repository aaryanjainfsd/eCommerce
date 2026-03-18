import {Schema, model } from "mongoose";

// SCHEMA   
const adminAuthSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },   
        password: { type: String, required: true },
        role: { type: String, default: "admin" }
    }, 
    { 
        timestamps: true,
        collection: "admin_auth_model"
    }
);

const AdminAuthModel = model("AdminAuth", adminAuthSchema);

export default AdminAuthModel;