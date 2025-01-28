import express from 'express';
import valideteRequest from '../../middlwares/validetRequest';
import { CourseControllers } from './course.controller';
import { CourseValidations } from './course.validation';
import auth from '../../middlwares/auth';

const router = express.Router();

router.post(
  '/create-course',
  auth('superAdmin', 'admin'),
  CourseControllers.createCourse,
);

router.get(
  '/',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  CourseControllers.getAllCourse,
);

router.get(
  '/:id',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  CourseControllers.getSingleCourse,
);

router.patch(
  '/:id',
  auth('superAdmin', 'admin'),
  valideteRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);

router.delete(
  '/:id',
  auth('superAdmin', 'admin'),
  CourseControllers.deleteCourse,
);

router.put(
  '/:courseId/assign-faculties',
  auth('superAdmin', 'admin'),
  valideteRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.assignFacultyWithCourse,
);

router.get(
  '/:courseId/get-faculties',
  auth('superAdmin', 'admin', 'faculty', 'student'),
  CourseControllers.getFacultyWithCourse,
);

router.delete(
  '/:courseId/remove-faculties',
  auth('superAdmin', 'admin'),
  valideteRequest(CourseValidations.facultiesWithCourseValidationSchema),
  CourseControllers.removeFacultyFromCourse,
);

export const CourseRouters = router;
