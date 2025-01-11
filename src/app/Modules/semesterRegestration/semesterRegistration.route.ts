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

router.get('/', SemesterRegistrationControllers.getAllSemesterRegestration);

router.get('/:id', SemesterRegistrationControllers.getSingleSemesterRegister);

router.patch(
  '/:id',
  valideteRequest(
    SemesterRegistrationValidations.updateSemesterRegestrationValidationSchema,
  ),
  SemesterRegistrationControllers.updateSemesterRegister,
);

router.delete('/:id', SemesterRegistrationControllers.deleteSemesterRegister)

export const SemesterRegistrationRouters = router;
