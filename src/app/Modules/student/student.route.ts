// ========= route -> controller -> service ==========
import express from 'express'
import { StudentController } from './student.controller'
import valideteRequest from '../../middlwares/validetRequest'
import { studentValidations } from './student.validation'

const router = express.Router()

// it will call controller

router.get('/', StudentController.getAllStudents)

router.get('/search', StudentController.searchStudent)

router.get('/:studentId', StudentController.getStudent)

router.patch('/:studentId', valideteRequest(studentValidations.updateStudentValidationSchema), StudentController.updateStudent)

router.delete('/:studentId', StudentController.deleteStudent)

export const StudentRouters = router;