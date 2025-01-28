import express from 'express';
import { OfferedCourseControllers } from './offeredCourses.controller';
import { OfferedCourseValidations } from './offeredCourses.validation';
import valideteRequest from '../../middlwares/validetRequest';
import auth from '../../middlwares/auth';

const router = express.Router();

router.post(
  '/create-offered-course',
  auth('superAdmin', 'admin'),
  valideteRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty'),
  OfferedCourseControllers.getAllOfferedCourses,
);

router.get(
  '/my-offered-course',
  auth('student'),
  OfferedCourseControllers.getMyOfferedCourse,
);

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  OfferedCourseControllers.getSingleOfferedCourses,
);

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  valideteRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  OfferedCourseControllers.deleteOfferedCourses,
);

export const OfferedCourseRoutes = router;
