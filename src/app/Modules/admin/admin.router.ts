// ========= route -> controller -> service ==========
import express from 'express';
import { AdminControllers } from './admin.controller';
import valideteRequest from '../../middlwares/validetRequest';
import { AdminValidations } from './admin.validation';
import auth from '../../middlwares/auth';

const router = express.Router();

router.get('/', auth('superAdmin', 'admin'), AdminControllers.getAllAdmins);

router.get('/:id', auth('superAdmin', 'admin'), AdminControllers.getAdmin);

router.patch(
  '/:id',
  auth('superAdmin'),
  valideteRequest(AdminValidations.updateAdminValidationSchema),
  AdminControllers.updateAdmin,
);

router.delete('/:id', auth('superAdmin'), AdminControllers.deleteAdmin);

export const AdminRouters = router;
