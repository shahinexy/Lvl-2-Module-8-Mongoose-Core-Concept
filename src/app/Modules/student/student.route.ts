import express from 'express'
import { StudentController } from './student.controller'

const router = express.Router()


// it will call controller
router.post('/create-student', StudentController.createStudent)