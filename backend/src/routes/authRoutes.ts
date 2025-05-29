import { Router } from 'express';
import { AuthController } from '../controllers/authController';

const router = Router();

router.post('/login', AuthController.login);
router.post('/logout', AuthController.logout);
router.get('/check-token', AuthController.checkToken);

export default router;