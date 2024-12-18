import { Schema, model } from 'mongoose';
import { Gurdian, Student, UserName } from './student/student.interface';
import validator from 'validator';

// Sub Schema
const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'First name is requird'],
    maxlength: [20, 'First Name cna not be grathre then 20'],
    trim: true,
    // custom validation
    // validate: {
    //   validator: function(value: string){
    //     const firstNameStr = value[0].toUpperCase() + value.slice(1).toLowerCase();
    //     return firstNameStr === value
    //   },
    //   message: '{VALUE} is not capitalize format'
    // }
  },
  middleName: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid'
    }
   },
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
      message: '{VALUE} is not supported',
    },
    required: true,
  },
  dateOfBirth: { type: String },
  email: { type: String, required: true, unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email' 
    }
   },
  contactNo: { type: String }, 
  emergancyNo: {type: String},
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  address: { type: String, required: true },
  gurdian: {
    type: gurdianSchema,
    required: true,
  },
  profileImg: { type: String },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
});

// Model
export const StudentModle = model<Student>('Student', studentSchema);
