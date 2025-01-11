import express from 'express';
import valideteRequest from '../../middlwares/validetRequest';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';

const router = express.Router();

router.post(
  '/login',
  valideteRequest(AuthValidations.loginUserValidationSchema),
  AuthControllers.loginUser,
);

export const AuthRouters = router;
