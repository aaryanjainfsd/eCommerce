import { Schema, model } from "mongoose";

// SCHEMA
const authSchema = new Schema({
	name: { type: String, required: true },
	username: { type: String, required: true, unique: true },
	phone: { type: String,required: true, default: "9999999999" },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, default: "customers" },
	avatar: { type: String, default: "default.jpg" }
}, { timestamps: true });

const AuthModel = model("users", authSchema);

export default AuthModel;
 