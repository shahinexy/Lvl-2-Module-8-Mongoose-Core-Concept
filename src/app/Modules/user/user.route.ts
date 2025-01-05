// ========= route -> controller -> service ==========
import express from 'express';
import { UsreControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import valideteRequest from '../../middlwares/validetRequest';
import { facultyValidations } from '../faculty/faculty.validation';

const router = express.Router();

router.post(
  '/create-student',
  valideteRequest(studentValidations.createStudentValidationSchema),
  UsreControllers.createStudent,
);

router.post(
  '/create-faculty',
  valideteRequest(facultyValidations.createFacultyValidationSchema),
  UsreControllers.createFaculty,
);

export const UserRouters = router;
