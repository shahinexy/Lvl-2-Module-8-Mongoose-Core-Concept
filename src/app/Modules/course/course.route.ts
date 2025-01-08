
import express from 'express'
import valideteRequest from '../../middlwares/validetRequest'
import { CourseControllers } from './course.controller'
import { CourseValidations } from './course.validation'

const router = express.Router()

router.post('/create-course', CourseControllers.createCourse)

router.get('/', CourseControllers.getAllCourse)

// router.get('/search', CourseControllers.searchCourse)

router.get('/:id', CourseControllers.getSingleCourse)

router.patch('/:id', valideteRequest(CourseValidations.updateCourseValidationSchema), CourseControllers.updateCourse)

router.delete('/:id', CourseControllers.deleteCourse)

export const CourseRouters = router;