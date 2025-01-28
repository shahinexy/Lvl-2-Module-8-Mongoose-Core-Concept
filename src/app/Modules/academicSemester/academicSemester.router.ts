import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controller';
import valideteRequest from '../../middlwares/validetRequest';
import { AcademicSemesterValidationSchema } from './academicSemester.validation';
import auth from '../../middlwares/auth';

const router = express.Router();

router.post(
  '/create-academic-semesters',
  auth('superAdmin', 'admin'),
  valideteRequest(
    AcademicSemesterValidationSchema.createAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.createAcademicSemester,
);

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  AcademicSemesterControllers.getAllAcademicSemester,
);

router.get(
  '/:semesterId',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
  '/:semesterId',
  auth('superAdmin', 'admin'),
  valideteRequest(
    AcademicSemesterValidationSchema.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateSingleAcademicSemester,
);

export const AcademicSemesterRoutes = router;
