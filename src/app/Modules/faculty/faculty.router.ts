// ========= route -> controller -> service ==========
import express from 'express';
import { FacultyControllers } from './faculty.controller';
import valideteRequest from '../../middlwares/validetRequest';
import { facultyValidations } from './faculty.validation';
import auth from '../../middlwares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// it will call controller

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.getAllFacultys,
);

router.get('/:id', FacultyControllers.getFaculty);

router.patch(
  '/:id',
  valideteRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete('/:id', FacultyControllers.deleteFaculty);

export const FacultyRouters = router;
