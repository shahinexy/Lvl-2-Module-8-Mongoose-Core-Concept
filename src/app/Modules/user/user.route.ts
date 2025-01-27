// ========= route -> controller -> service ==========
import express, { NextFunction, Request, Response } from 'express';
import { UsreControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import valideteRequest from '../../middlwares/validetRequest';
import { facultyValidations } from '../faculty/faculty.validation';
import { AdminValidations } from '../admin/admin.validation';
import auth from '../../middlwares/auth';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-student',
  auth('superAdmin', 'admin'),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    req.body = JSON.parse(req.body.data);
    next();
  },
  valideteRequest(studentValidations.createStudentValidationSchema),
  UsreControllers.createStudent,
);

router.post(
  '/create-faculty',
  auth('superAdmin', 'admin'),
  valideteRequest(facultyValidations.createFacultyValidationSchema),
  UsreControllers.createFaculty,
);

router.post(
  '/create-admin',
  auth('superAdmin'),
  valideteRequest(AdminValidations.createAdminValidationSchema),
  UsreControllers.createAdmin,
);

router.post(
  '/change-status/:id',
  auth('superAdmin', 'admin'),
  valideteRequest(UserValidation.changeStatusValidationSchema),
  UsreControllers.changeStatus,
);

router.get(
  '/me',
  auth('superAdmin', 'student', 'faculty', 'admin'),
  UsreControllers.getMe,
);

export const UserRouters = router;
