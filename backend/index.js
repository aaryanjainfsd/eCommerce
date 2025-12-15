import "dotenv/config";
import express from "express";
import connectToDB from "./config/db.js";
import productRouter from "./routes/ProductRouter.js";
import authRouter from "./routes/AuthRouter.js";
import cors from "cors";



const app = express();
app.use(express.json());

app.use(cors({
	origin: "http://localhost:5173",
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true
}));

// ✅ ADD THIS LINE HERE
app.use("/uploads", express.static("uploads"));

// Connect to Mongo Database
await connectToDB();

//Redirect to Product Routes
app.use("/products", productRouter);
app.use("/auth", authRouter);

app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`); });
