// ========= route -> controller -> service ==========
import express from 'express'
import { AdminControllers } from './admin.controller';
import valideteRequest from '../../middlwares/validetRequest'
import { AdminValidations } from './admin.validation'

const router = express.Router()


router.get('/', AdminControllers.getAllAdmins)

router.get('/:id', AdminControllers.getAdmin)

router.patch('/:id', valideteRequest(AdminValidations.updateAdminValidationSchema), AdminControllers.updateAdmin)

router.delete('/:id', AdminControllers.deleteAdmin)

export const AdminRouters = router;