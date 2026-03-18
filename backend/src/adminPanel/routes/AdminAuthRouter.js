import { Router } from 'express';
import { loginFunction, registerFunction } from '../controllers/AdminAuthController.js';
const adminAuthRouter = Router();

adminAuthRouter.post('/login', loginFunction);
adminAuthRouter.post('/register', registerFunction);


export default adminAuthRouter;