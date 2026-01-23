import AuthModel from '../models/AuthModel.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

export async function registerUser(req, res) {
    try {
		const { name, email, username, phone, password, role, avatar } = req.body;

		// check if user already exists
		const existing = await AuthModel.findOne({ email });
		if (existing) {
			res.status(409).json({ message: "Email already registered" });
		} else {
			// hash password
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);

			// create user with hashed password
			const newUser = await AuthModel.create({
				name,
                username,
                phone,
				email,
				password: hashedPassword,
				role,
				avatar
			});		

			res.status(201).json({
				message: "User registered successfully",
				user: newUser
			});
		}
	} catch (error) {
		console.error("Error registering user:", error);
		res.status(500).json({
			message: "Failed to register user",
			error: error.message
		});
	}
}

export async function loginUser(req, res) {
	try {
		const { email, password } = req.body;

		// Find user with email.
		const user = await AuthModel.findOne({ email });
		if (!user) 
        {
			res.status(404).json({ message: "User not found" });
		}
        else 
        {
			// Match Password.
			const matched = await bcrypt.compare(password, user.password);
			if (!matched) 
            {
				res.status(401).json({ message: "Incorrect password" });
			} 
            else 
            {

                // -------------------------
				// CREATE JWT TOKEN
				// -------------------------
				const token = jwt.sign(
					{ id: user._id, email: user.email },
					process.env.JWT_SECRET,
					{ expiresIn: "7d" }
				);

				// -------------------------
				// STORE TOKEN IN COOKIE
				// -------------------------
				res.cookie("token", token, {
					httpOnly: true,
					secure: false,
					sameSite: "strict",
					maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
				});
                
				res.status(200).json({
					message: "Login successful",
					user
				});
			}
		}
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ message: "Login failed", error: error.message });
	}
}

export async function getUser(req, res) {
	try {
		const userId = req.params.id;

		// Find user by ID
		const user = await AuthModel.findById(userId);
        console.log("Fetched user:", user);

		if (!user) {
			res.status(404).json({ message: "User not found" });
		} else {
			res.status(200).json({
				message: "User fetched successfully",
				user
			});
		}
	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).json({
			message: "Failed to fetch user",
			error: error.message
		});
	}
}

export async function getAllUsers(req, res) {
    try
    {
        const users = await AuthModel.find();
        res.status(200).json({
            message: "All users fetched successfully",
            users
        });
    }              
    catch (error)   
    {
        console.error("Error fetching users:", error);
        res.status(500).json({
            message: "Failed to fetch users",
            error: error.message
        });
    }
}

export async function deleteUser(req, res) {
    try 
    {
        const userId = req.params.id;       
        const deletedUser = await AuthModel.findByIdAndDelete(userId);

        if (!deletedUser) 
        {
            res.status(404).json({ message: "User not found" });
        }
        else 
        {    
            res.status(200).json({
                message: "User deleted successfully",
                user: deletedUser
            });
        }
    }    
    catch (error) 
    {
        console.error("Error deleting user:", error);
        res.status(500).json({
            message: "Failed to delete user",
            error: error.message
        });
    }

}

export async function updateUser(req, res) {
    try 
    {
        const userId = req.params.id;       
        const updateData = req.body;    

        const updateObj = {
			$set: updateData,
			$inc: { __v: 1 }
		};

        const updatedUser = await AuthModel.findByIdAndUpdate(
			userId,
			updateObj,
			{ new: true, runValidators: true }
		);
        

        if (!updatedUser) 
        {
            res.status(404).json({ message: "User not found" });
        }
        else 
        {    
            res.status(200).json({
                message: "User updated successfully",
                user: updatedUser
            });
        }
    }
    catch (error) 
    {
        console.error("Error updating user:", error);
        res.status(500).json({
            message: "Failed to update user",
            error: error.message
        });
    }
}

