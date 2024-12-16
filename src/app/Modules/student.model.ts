import { Schema, model } from 'mongoose';
import { Gurdian, Student, UserName } from './student/student.interface';

// Sub Schema
const userNameSchema = new Schema<UserName>({
  firstName: { type: String, required: true },
  middleName: { type: String },
  lastName: { type: String, required: true },
});

// Sub Schema
const gurdianSchema = new Schema<Gurdian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
});

// Main Schema
const studentSchema = new Schema<Student>({
  id: { type: String },
  name: userNameSchema,
  gender: ['female', 'male'],
  dateOfBirth: { type: String },
  email: { type: String, required: true },
  contactNo: { type: String },
  bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  address: { type: String, required: true },
  gurdian: gurdianSchema,
  profileImg: { type: String },
  isActive: ['active', 'blocked'],
});

// Model
export const StudentModle = model<Student>('Student', studentSchema)
