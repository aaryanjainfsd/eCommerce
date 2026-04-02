import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./src/shared/config/swagger.js";

// DB Connection 
import connectToDB from "./src/shared/config/db.js";
import ClientRouter from "./src/shared/routes/ClientRouter.js";

// --------------------------- STOREFRONT ROUTES --------------------------------------------
import authRouter from "./src/storeFront/routes/AuthRouter.js";
import productRouter from "./src/storeFront/routes/ProductRouter.js";
// ------------------------------------------------------------------------------------------

//----------------------------- ADMIN ROUTES ------------------------------------------------
import AdminAuthRouter from "./src/adminPanel/routes/AdminAuthRouter.js";
// ------------------------------------------------------------------------------------------

//----------------------------- SUPER ADMIN ROUTES ------------------------------------------
import SuperAdminAuthRouter from "./src/superAdminPanel/routes/SuperAdminAuthRouter.js";
// ------------------------------------------------------------------------------------------

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
	origin: [
		process.env.FRONTEND_URL,
		"http://localhost:5173"
	],
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
	credentials: true
}));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, { explorer: true }));
app.use("/uploads", express.static("uploads"));

// Connect to Mongo Database
await connectToDB();

//----------------------------- SHARED ROUTES ------------------------------------------------
app.use("/shared/clients", ClientRouter);
// -------------------------------------------------------------------------------------------

// --------------------------- STOREFRONT ROUTES --------------------------------------------
app.use("/storefront/products", productRouter);
app.use("/storefront/auth", authRouter);
// ------------------------------------------------------------------------------------------

//----------------------------- ADMIN ROUTES -------------------------------------------------
app.use("/admin/auth", AdminAuthRouter);
// -------------------------------------------------------------------------------------------

//----------------------------- SUPER ADMIN ROUTES​ -------------------------------------------
app.use("/superAdmin/auth", SuperAdminAuthRouter);
// -------------------------------------------------------------------------------------------



// Starting the server
app.listen(process.env.PORT, () => { console.log(`Server is running on port ${process.env.PORT}`); });
