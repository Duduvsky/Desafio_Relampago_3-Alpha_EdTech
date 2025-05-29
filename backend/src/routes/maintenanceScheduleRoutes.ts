import { Router } from 'express';
import { MaintenanceScheduleController } from '../controllers/maintenanceScheduleController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', MaintenanceScheduleController.create);
router.get('/', MaintenanceScheduleController.getAll);
router.get('/asset/:assetId', MaintenanceScheduleController.getByAsset);
router.get('/pending', MaintenanceScheduleController.getPending);
router.get('/:id', MaintenanceScheduleController.getById);
router.put('/:id', MaintenanceScheduleController.update);
router.patch('/:id/complete', MaintenanceScheduleController.complete);
router.delete('/:id', MaintenanceScheduleController.delete);

export default router;