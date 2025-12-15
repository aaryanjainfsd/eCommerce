import { Schema, model } from "mongoose";

// SCHEMA
const authSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, default: "user" },
	avatar: { type: String, default: "" }
}, { timestamps: true });

const AuthModel = model("auth-model", authSchema);

export default AuthModel;
