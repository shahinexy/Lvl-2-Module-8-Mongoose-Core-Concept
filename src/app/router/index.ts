import { Router } from 'express';
import { StudentRouters } from '../Modules/student/student.route';
import { UserRouters } from '../Modules/user/user.route';
import { AcademicSemesterRoutes } from '../Modules/academicSemester/academicSemester.router';
import { AcademicFacultyRoutes } from '../Modules/academicFaculty/academicFaculty.router';
import { AcademicDepartmentRoutes } from '../Modules/academicDepartment/academicDepartment.router';
import { FacultyRouters } from '../Modules/faculty/faculty.router';
import { AdminRouters } from '../Modules/admin/admin.router';
import { CourseRouters } from '../Modules/course/course.route';
import { SemesterRegistrationRouters } from '../Modules/semesterRegestration/semesterRegistration.route';

const router = Router();

const moduleRouter = [
  {
    path: '/users',
    router: UserRouters,
  },
  {
    path: '/students',
    router: StudentRouters,
  },
  {
    path: '/faculties',
    router: FacultyRouters,
  },
  {
    path: '/admins',
    router: AdminRouters,
  },
  {
    path: '/academic-semesters',
    router: AcademicSemesterRoutes,
  },
  {
    path: '/academic-faculties',
    router: AcademicFacultyRoutes,
  },
  {
    path: '/academic-departments',
    router: AcademicDepartmentRoutes,
  },
  {
    path: '/courses',
    router: CourseRouters,
  },
  {
    path: '/semester-regestrations',
    router: SemesterRegistrationRouters,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.router));

export default router;
