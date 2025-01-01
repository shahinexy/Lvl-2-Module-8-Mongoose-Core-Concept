import { model, Schema } from 'mongoose';
import { TAcademicSemester } from './academicSemester.inferface';
import {
  AcademicSemesterSchemaCode,
  AcademicSemesterSchemaName,
  Months,
} from './academicSemester.constant';
import AppError from '../../error/AppError';

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
  year: { type: String, required: true },
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
},{
  timestamps: true
});


AcademicSemesterSchema.pre("save", async function(next) {
  const isSemesterExists = await AcademicSemesterModel.findOne({
    year: this.year,
    name: this.name
  })
  if(isSemesterExists) {
    throw new AppError(404, 'Semester is alredy exists!')
  }
  next()
})



export const AcademicSemesterModel = model<TAcademicSemester>(
  'AcademicSemester',
  AcademicSemesterSchema,
);
