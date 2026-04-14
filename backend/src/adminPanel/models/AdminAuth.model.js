import {Schema, model } from "mongoose";

const adminAuthSchema = new Schema(
    {
        foreignKeys: {
            client_id: {
                type: Schema.Types.ObjectId,
                ref: "client",
                required: true,
                unique: true
            },
            future_sample_id: { type: String, required: true, trim: true }
        },
        data: {
            username: { type: String, required: true, unique: true },
            password: { type: String, required: true },
        }
    },
    {
        timestamps: true,
        collection: "admin_auth_credentials"
    }
);



const AdminAuthModel = model("admin_auth_credentials", adminAuthSchema);

export default AdminAuthModel;