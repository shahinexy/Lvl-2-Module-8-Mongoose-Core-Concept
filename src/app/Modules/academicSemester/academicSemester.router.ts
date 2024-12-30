
import  express  from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import valideteRequest from "../../middlwares/validetRequest";
import AcademicSemesterValidationSchema from "./academicSemester.validation";

const router = express.Router();

router.post('/create-academic-semesters', valideteRequest(AcademicSemesterValidationSchema) ,AcademicSemesterControllers.createAcademicSemester);
router.get('/', AcademicSemesterControllers.getAllAcademicSemester);
router.get('/:semesterId', AcademicSemesterControllers.getSingleAcademicSemester);

export const AcademicSemesterRoutes = router;