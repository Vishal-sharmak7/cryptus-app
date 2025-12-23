import expess from 'express';
import { login } from '../controllers/user.controller.js';



const router = expess.Router();

router.post('/login', login);





export default router