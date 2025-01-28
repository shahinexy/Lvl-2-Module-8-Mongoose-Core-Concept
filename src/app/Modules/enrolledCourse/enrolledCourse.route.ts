import express from 'express';
import auth from '../../middlwares/auth';
import valideteRequest from '../../middlwares/validetRequest';
import { EnrolledCourseValidations } from './enrolledCourse.validation';
import { EnrolledCourseControllers } from './enrolledCourse.controller';
const router = express.Router();

router.post(
  '/create-enrolled-course',
  auth('student'),
  valideteRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.createEnrolledCourse,
);

router.patch(
  '/update-enrolled-course-marks',
  auth('superAdmin', 'admin', 'faculty'),
  valideteRequest(
    EnrolledCourseValidations.createEnrolledCourseValidationZodSchema,
  ),
  EnrolledCourseControllers.updateEnrolledCourseMarksIntoDB,
);

export const EnrolledCourseRoutes = router;
