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
import { OfferedCourseRoutes } from './../Modules/offeredCourses/offeredCourses.router';
import { AuthRouters } from '../Modules/auth/auth.route';
import { EnrolledCourseRoutes } from '../Modules/enrolledCourse/enrolledCourse.route';

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
  {
    path: '/offered-courses',
    router: OfferedCourseRoutes,
  },
  {
    path: '/auth',
    router: AuthRouters,
  },
  {
    path: '/enrolled-courses',
    router: EnrolledCourseRoutes,
  },
];

moduleRouter.forEach((route) => router.use(route.path, route.router));

export default router;
