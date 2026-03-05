import "dotenv/config";
import express from "express";
import connectToDB from "./config/db.js";
import productRouter from "./routes/StoreFrontRoutes/ProductRouter.js";
import authRouter from "./routes/StoreFrontRoutes/AuthRouter.js";
import cors from "cors";
import cookieParser from "cookie-parser";



const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(cors({
	origin: "http://localhost:5173",
	methods: ["GET", "POST", "PUT", "DELETE"],
	credentials: true
}));

// ✅ ADD THIS LINE HERE
app.use("/uploads", express.static("uploads"));

// Connect to Mongo Database
await connectToDB();

//STORE FRONT ROUTES
app.use("/products", productRouter);
app.use("/auth", authRouter);

// ADMIN ROUTES
// app.use("/admin/auth", adminAuthRouter);

app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`); });
