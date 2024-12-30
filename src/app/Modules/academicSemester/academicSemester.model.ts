import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.inferface';
import {
  AcademicSemesterSchemaCode,
  AcademicSemesterSchemaName,
  Months,
} from './academicSemester.constant';

const AcademicSemesterSchema = new Schema<TAcademicSemester>({
  name: {
    type: String,
    required: true,
    enum: AcademicSemesterSchemaName,
  },
  code: {
    type: String,
    required: true,
    enum: AcademicSemesterSchemaCode,
  },
  year: { type: Date, required: true },
  startMonth: {
    type: String,
    required: true,
    enum: Months,
  },
  endMonth: {
    type: String,
    required: true,
    enum: Months,
  },
});

export const AcademicSemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  AcademicSemesterSchema,
);
