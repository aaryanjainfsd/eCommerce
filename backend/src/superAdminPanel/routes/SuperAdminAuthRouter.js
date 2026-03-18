import { Router } from 'express';
import { loginFunction, registerFunction, logoutFunction } from '../controllers/SuperAdminAuthController.js';

const superAdminAuthRouter = Router();

superAdminAuthRouter.post('/login', loginFunction);
superAdminAuthRouter.post('/register', registerFunction);
superAdminAuthRouter.post('/logout', logoutFunction);

export default superAdminAuthRouter;