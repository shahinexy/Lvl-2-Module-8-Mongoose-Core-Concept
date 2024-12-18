// ========= route -> controller -> service ==========
import express from 'express'
import { StudentController } from './student.controller'

const router = express.Router()

// it will call controller
router.post('/create-student', StudentController.createStudent)

router.get('/', StudentController.getAllStudents)

router.get('/:studentId', StudentController.getStudent)

router.delete('/:studentId', StudentController.deleteStudent)

export const StudentRouters = router;