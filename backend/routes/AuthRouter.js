import Router from 'express';
import { registerUser, loginUser, getUser, getAllUsers, deleteUser, updateUser} from '../controllers/AuthController.js';

const authRouter = Router();

// Redirecting to controller functions
authRouter.get('/get', getAllUsers);
authRouter.get('/get/:id', getUser);
authRouter.post('/login', loginUser);
authRouter.post('/register', registerUser);
authRouter.delete('/delete/:id', deleteUser);
authRouter.put('/update/:id', updateUser);
export default authRouter;

