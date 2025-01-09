import express from 'express';
import valideteRequest from '../../middlwares/validetRequest';
import { SemesterRegistrationValidations } from './semesterRegistration.validation';
import { SemesterRegistrationControllers } from './semesterRegistration.controller';

const router = express.Router();

router.post(
  '/create-semester-regestration',
  valideteRequest(
    SemesterRegistrationValidations.createSemesterRegestrationValidationSchema,
  ),
  SemesterRegistrationControllers.createSemesterRegestration,
);

router.get('/', SemesterRegistrationControllers.getAllSemesterRegestration)

export const SemesterRegistrationRouters = router;
