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
  auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty),
  FacultyControllers.getAllFacultys,
);

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty'),
  FacultyControllers.getFaculty,
);

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  valideteRequest(facultyValidations.updateFacultyValidationSchema),
  FacultyControllers.updateFaculty,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  FacultyControllers.deleteFaculty,
);

export const FacultyRouters = router;
