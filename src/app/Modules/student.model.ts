import { Schema, model } from 'mongoose';
import { Gurdian, Student, UserName } from './student/student.interface';

// Sub Schema
const userNameSchema = new Schema<UserName>({
  firstName: { type: String, required: [true, 'First name is requird'] },
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
  id: { type: String, required: true, unique: true },
  name: {
    type: userNameSchema,
    required: true,
  },
  gender: {
    type: String,
    enum: {
      values: ['female', 'male'],
      message: '{VALUE} is not supported'
    },
    required: true
  },
  dateOfBirth: { type: String },
  email: { type: String, required: true, unique: true },
  contactNo: { type: String },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  address: { type: String, required: true },
  gurdian: {
    type: gurdianSchema,
    required: true
  },
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active'
  },
});

// Model
export const StudentModle = model<Student>('Student', studentSchema)
