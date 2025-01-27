// ========= route -> controller -> service ==========
import express from 'express';
import { StudentController } from './student.controller';
import valideteRequest from '../../middlwares/validetRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlwares/auth';

const router = express.Router();

// it will call controller

router.get('/', auth('superAdmin', 'admin'), StudentController.getAllStudents);

router.get(
  '/:studentId',
  auth('superAdmin', 'admin', 'faculty'),
  StudentController.getStudent,
);

router.patch(
  '/:studentId',
  auth('superAdmin', 'admin'),
  valideteRequest(studentValidations.updateStudentValidationSchema),
  StudentController.updateStudent,
);

router.delete(
  '/:studentId',
  auth('superAdmin', 'admin'),
  StudentController.deleteStudent,
);

export const StudentRouters = router;
