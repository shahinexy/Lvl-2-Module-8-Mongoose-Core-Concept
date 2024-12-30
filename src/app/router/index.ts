import { Router } from "express";
import { StudentRouters } from "../Modules/student/student.route";
import { UserRouters } from "../Modules/user/user.route";
import { AcademicSemesterRoutes } from "../Modules/academicSemester/academicSemester.router";


const router = Router();

const moduleRouter = [
    {
        path: '/students',
        router: StudentRouters
    },
    {
        path: '/users',
        router: UserRouters
    },
    {
        path: '/academic-semesters',
        router: AcademicSemesterRoutes
    }
]

moduleRouter.forEach((route) => router.use(route.path, route.router))

export default router;