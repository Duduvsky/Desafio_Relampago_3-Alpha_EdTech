import { Router } from 'express';
import { AssetController } from '../controllers/assetController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', AssetController.create);
router.get('/', AssetController.getAll);
router.get('/:id', AssetController.getById);
router.get('/:id/with-maintenance', AssetController.getWithMaintenance);
router.put('/:id', AssetController.update);
router.delete('/:id', AssetController.delete);

export default router;