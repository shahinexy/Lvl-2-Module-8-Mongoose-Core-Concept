// ========= route -> controller -> service ==========
import express from 'express';
import { UsreControllers } from './user.controller';
import { studentValidations } from '../student/student.validation';
import valideteRequest from '../../middlwares/validetRequest';

const router = express.Router();

router.post(
  '/create-student',
  valideteRequest(studentValidations.studentValidationSchema),
  UsreControllers.createStudent,
);

export const UserRouters = router;
