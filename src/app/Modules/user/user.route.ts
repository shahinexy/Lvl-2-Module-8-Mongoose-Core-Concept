// ========= route -> controller -> service ==========
import express from 'express'

const router = express.Router()

router.post('/create-student', UserController.createStudent)

export const StudentRouters = router;