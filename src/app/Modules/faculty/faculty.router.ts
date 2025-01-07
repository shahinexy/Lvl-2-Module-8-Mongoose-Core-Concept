// ========= route -> controller -> service ==========
import express from 'express'
import { FacultyControllers } from './faculty.controller'

const router = express.Router()

// it will call controller

router.get('/', FacultyControllers.getAllFacultys)

router.get('/search', FacultyControllers.searchFaculty)

router.get('/:id', FacultyControllers.getFaculty)

// router.patch('/:facultyId', valideteRequest(facultyValidations.updateFacultyValidationSchema), FacultyControllers.updateFacult)

router.delete('/:id', FacultyControllers.deleteFaculty)

export const FacultyRouters = router;