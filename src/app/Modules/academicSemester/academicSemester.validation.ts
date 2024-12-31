import { z } from "zod";
import { AcademicSemesterSchemaCode, AcademicSemesterSchemaName, Months } from "./academicSemester.constant";

const createAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...AcademicSemesterSchemaName as [string, ...string[]]]),
        code: z.enum([...AcademicSemesterSchemaCode as [string, ...string[]]]),
        year: z.string(),
        startMonth: z.enum([...Months as [string, ...string[]]]),
        endMonth: z.enum([...Months as [string, ...string[]]]),
    })
})  

const updateAcademicSemesterValidationSchema = z.object({
    body: z.object({
        name: z.enum([...AcademicSemesterSchemaName as [string, ...string[]]]).optional(),
        code: z.enum([...AcademicSemesterSchemaCode as [string, ...string[]]]).optional(),
        year: z.string().optional(),
        startMonth: z.enum([...Months as [string, ...string[]]]).optional(),
        endMonth: z.enum([...Months as [string, ...string[]]]).optional(),
    })
})  

export const AcademicSemesterValidationSchema ={
    createAcademicSemesterValidationSchema,
    updateAcademicSemesterValidationSchema
};