

import { model, Schema } from "mongoose"
import { TAcademicFaculty } from "./academicFaculty.interface"

const academicFacultySchema = new Schema<TAcademicFaculty>({
    name: {type: String, required: true, unique: true}
},{
    timestamps: true
})

academicFacultySchema.pre('save', async function (next) {
  const isDepartmentExists = await AcademicFacultyModel.findOne({
    name: this.name,
  });

  if (isDepartmentExists) {
    throw new Error('Faculty already exists');
  }
  next();
});

academicFacultySchema.pre('findOneAndUpdate', async function (next) {
    
  const query = this.getQuery();

  const isDepartmentExists = await AcademicFacultyModel.findOne(query);

  if (!isDepartmentExists) {
    throw new Error('Faculty dose not exists');
  }
  next();
});


export const AcademicFacultyModel = model<TAcademicFaculty>('AcademicFaculty', academicFacultySchema)