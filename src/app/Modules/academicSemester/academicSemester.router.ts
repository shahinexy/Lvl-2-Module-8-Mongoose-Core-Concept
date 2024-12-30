
import  express  from "express";
import { AcademicSemesterControllers } from "./academicSemester.controller";
import valideteRequest from "../../middlwares/validetRequest";
import AcademicSemesterValidationSchema from "./academicSemester.validation";

const router = express.Router();

router.get('/', valideteRequest(AcademicSemesterValidationSchema) ,AcademicSemesterControllers.createAcademicSemester);

export const AcademicSemesterRouter = router;