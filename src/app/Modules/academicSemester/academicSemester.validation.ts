import { z } from "zod";
import { AcademicSemesterSchemaCode, AcademicSemesterSchemaName, Months } from "./academicSemester.constant";

const AcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...AcademicSemesterSchemaName as [string, ...string[]]]),
        code: z.enum([...AcademicSemesterSchemaCode as [string, ...string[]]]),
        year: z.date(),
        startMonth: z.enum([...Months as [string, ...string[]]]),
        endtMonth: z.enum([...Months as [string, ...string[]]]),
    })
})  