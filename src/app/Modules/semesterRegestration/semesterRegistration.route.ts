import express from 'express';
import valideteRequest from '../../middlwares/validetRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';
import auth from '../../middlwares/auth';

const router = express.Router();

router.post(
  '/create-semester-regestration',
  auth('superAdmin', 'admin'),
  valideteRequest(
    SemesterRegistrationValidations.createSemesterRegestrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegestration,
);

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  SemesterRegistrationControllers.getAllSemesterRegestration,
);

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  SemesterRegistrationControllers.getSingleSemesterRegister,
);

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  valideteRequest(
    SemesterRegistrationValidations.updateSemesterRegestrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegister,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  SemesterRegistrationControllers.deleteSemesterRegister,
);

export const SemesterRegistrationRouters = router;
