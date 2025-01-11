import express from 'express';
import { OfferedCourseControllers } from './offeredCourses.controller';
import { OfferedCourseValidations } from './offeredCourses.validation';
import valideteRequest from '../../middlwares/validetRequest';

const router = express.Router();

router.post(
  '/create-offered-course',
  valideteRequest(OfferedCourseValidations.createOfferedCourseValidationSchema),
  OfferedCourseControllers.createOfferedCourse,
);

router.get('/', OfferedCourseControllers.getAllOfferedCourses);

router.get('/:id', OfferedCourseControllers.getSingleOfferedCourses);

router.patch(
  '/:id',
  valideteRequest(OfferedCourseValidations.updateOfferedCourseValidationSchema),
  OfferedCourseControllers.updateOfferedCourse,
);

router.delete('/:id', OfferedCourseControllers.deleteOfferedCourses);

export const offeredCourseRoutes = router;
