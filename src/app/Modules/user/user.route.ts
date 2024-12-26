// ========= route -> controller -> service ==========
import express from 'express'
import { UsreControllers } from './user.controller';

const router = express.Router()

router.post('/create-student', UsreControllers.createStudent)

export const UserRouters = router;