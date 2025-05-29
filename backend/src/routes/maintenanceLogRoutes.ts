import { Router } from 'express';
import { MaintenanceLogController } from '../controllers/maintenanceLogController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', MaintenanceLogController.getAll); 
router.post('/', MaintenanceLogController.create);
router.get('/asset/:assetId', MaintenanceLogController.getByAsset);
router.get('/:id', MaintenanceLogController.getById);
router.put('/:id', MaintenanceLogController.update);
router.delete('/:id', MaintenanceLogController.delete);

export default router;