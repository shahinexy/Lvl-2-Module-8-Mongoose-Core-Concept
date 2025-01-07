// ========= route -> controller -> service ==========
import express from 'express'
import { FacultyControllers } from './faculty.controller'
import valideteRequest from '../../middlwares/validetRequest'
import { facultyValidations } from './faculty.validation'

const router = express.Router()

// it will call controller

router.get('/', FacultyControllers.getAllFacultys)

router.get('/search', FacultyControllers.searchFaculty)

router.get('/:id', FacultyControllers.getFaculty)

router.patch('/:id', valideteRequest(facultyValidations.updateFacultyValidationSchema), FacultyControllers.updateFaculty)

router.delete('/:id', FacultyControllers.deleteFaculty)

export const FacultyRouters = router;