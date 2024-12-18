import { Schema, model } from 'mongoose';
import {
  Gurdian,
  ModelOfStudent,
  Student,
  UserName,
} from './student/student.interface';
import validator from 'validator';
import bcrypt from 'bcrypt'
import config from '../config';

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
  lastName: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
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
const studentSchema = new Schema<Student, ModelOfStudent>({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
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
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email',
    },
  },
  contactNo: { type: String },
  emergancyNo: { type: String },
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
  isDeleted: {
    type: Boolean,
    default: false
  }
},{
  toJSON: {
    virtuals: true
  }
});

// virtual
studentSchema.virtual('fullName').get( function(){
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`
})


// Middleware 
// Pre save middleware / Hook
studentSchema.pre('save', async function(next) {
  this.password = await bcrypt.hash(this.password, Number(config.bcrypt_salt_round))
  next();
});

// Post save middleware / Hook
studentSchema.post('save', function(doc, next) {
  doc.password = '';
  next()
});

studentSchema.pre('find', function(next){
  this.find({isDeleted : {$ne : true}})
  next()
})

studentSchema.pre('findOne', function(next){
  this.find({isDeleted : {$ne : true}})
  next()
})

studentSchema.pre('aggregate', function(next){
  this.pipeline().unshift({$match : {isDeleted: {$ne : true}}})
  next()
})


// Create a custom instance method
// studentSchema.methods.isUserExists = async function(id: string){
//   const existingUser = await StudentModle.findOne({id})
//   return existingUser;
// }

// Create a custom statics method
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await StudentModle.findOne({ id });
  return existingUser;
};

// Model
export const StudentModle = model<Student, ModelOfStudent>(
  'Student',
  studentSchema,
);
