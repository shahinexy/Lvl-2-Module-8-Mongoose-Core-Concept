import { Router } from "express";
import { StudentRouters } from "../Modules/student/student.route";
import { UserRouters } from "../Modules/user/user.route";
import { AcademicSemesterRoutes } from "../Modules/academicSemester/academicSemester.router";
import { AcademicFacultyRoutes } from "../Modules/academicFaculty/academicFaculty.router";
import { AcademicDepartmentRoutes } from "../Modules/academicDepartment/academicDepartment.router";
import { FacultyRouters } from "../Modules/faculty/faculty.router";


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
    },
    {
        path: '/academic-faculties',
        router: AcademicFacultyRoutes
    },
    {
        path: '/academic-departments',
        router: AcademicDepartmentRoutes
    },
    {
        path: '/faculties',
        router: FacultyRouters
    },
]

moduleRouter.forEach((route) => router.use(route.path, route.router))

export default router;