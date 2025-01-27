import express from 'express';
import valideteRequest from '../../middlwares/validetRequest';
import { AcademicFacultyValidation } from './academicFaculty.validation';
import { AcademicFacultyControllers } from './academicFaculty.controller';
import auth from '../../middlwares/auth';

const router = express.Router();

router.post(
  '/create-academic-faculty',
  auth('superAdmin', 'admin'),
  valideteRequest(
    AcademicFacultyValidation.createAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.createAcademicFaculty,
);

router.get('/', AcademicFacultyControllers.getAllAcademicFaculty);

router.get(
  '/:facultyId',
  AcademicFacultyControllers.getSingleAcademicFaculty,
);

router.patch(
  '/:facultyId',
  valideteRequest(
    AcademicFacultyValidation.UpdateAcademicFacultyValidationSchema,
  ),
  AcademicFacultyControllers.updateSingleAcademicFaculty,
);

export const AcademicFacultyRoutes = router;
