import Router from 'express';
import { registerUser, loginUser, getSingleUser, getAllUsers, deleteUser, updateUser} from '../../controllers/AuthController.js';

const authRouter = Router();


// Redirecting to controller functions
authRouter.get('/get', getAllUsers);
authRouter.post('/login', loginUser);
authRouter.get('/get/:id', getSingleUser);
authRouter.put('/update/:id', updateUser);
authRouter.post('/register', registerUser);
authRouter.delete('/delete/:id', deleteUser);
export default authRouter;

