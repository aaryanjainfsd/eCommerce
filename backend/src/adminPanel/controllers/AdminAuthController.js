import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import AdminAuthModel from '../models/AdminAuth.model.js';


export async function registerFunction(req, res){
    try
    {
        const {name , username , password, role } = req.body;

        const existing = await AdminAuthModel.findOne({ username });
        if (existing) {
            res.status(409).json({ message: "Username already registered" });
        } else {
            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);   

            const newAdmin = await AdminAuthModel.create({
                name,
                username,
                password: hashedPassword,
                role
            });

            res.status(201).json({ 
                message: "Admin registered successfully", 
                admin: newAdmin 
            });
        }
    }
    catch (error)
    {
        console.log("Some error came");
        res.status(500).json({
            message: "Admin registration failed",
            error: error.message
        });
    }
}

export async function loginFunction(req, res){
    try 
    {
        const { username , password , role} = req.body;
        const user = await AdminAuthModel.findOne({ username });
        if (!user)
        {
            return res.status(404).json({ message: "Invalid username or password" });
        }
        else
        { 
            const matched = await bcrypt.compare(password, user.password);
            if (!matched) {
                return res.status(401).json({ message: "Incorrect password" });
            }
            else
            {
                // -------------------------
				// CREATE JWT TOKEN
				// -------------------------
                const token = jwt.sign(
                    {
                        id : user._id, 
                        username: user.username, 
                        role: user.role
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: '7d' }
                );

                // -------------------------
				// STORE TOKEN IN COOKIE
				// -------------------------
                res.cookie("AdminLoginToken", token, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 7 * 24 * 60 * 60 * 1000
                });

                return res.status(200).json({
                    message: "Admin login successful",
                    user : user
                });
            }
        }
    }
    catch (error)
    {
        console.log("Some error came");
        res.status(500).json({
            message: "Admin login failed",
            error: error.message
        });
    }
}
