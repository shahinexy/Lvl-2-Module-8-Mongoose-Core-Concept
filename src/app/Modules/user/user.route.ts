// ========= route -> controller -> service ==========
import express from 'express';
import { UsreControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import valideteRequest from '../../middlwares/validetRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import auth from '../../middlwares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  valideteRequest(studentValidations.createStudentValidationSchema),
  UsreControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth(USER_ROLE.admin),
  valideteRequest(facultyValidations.createFacultyValidationSchema),
  UsreControllers.createFaculty,
);

router.post(
  '/create-admin',
  // auth(USER_ROLE.admin),
  valideteRequest(AdminValidations.createAdminValidationSchema),
  UsreControllers.createAdmin,
);

export const UserRouters = router;
