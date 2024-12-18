import { Schema, model, connect, Model } from 'mongoose';

// Sub Interface
export type UserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

// Sub Interface
export type Gurdian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

// Main Interface
export type Student = {
  id: string;
  password: string,
  name: UserName;
  gender: 'male' | 'female';
  dateOfBirth?: string;
  email: string;
  contactNo: string;
  emergancyNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address: string;
  gurdian: Gurdian;
  profileImg: string;
  isActive: "active" | "blocked"
};


// Create a custom instance method
// export type StudentMethods = {
//   isUserExists(id: string) : Promise<Student | null>
// }

// export type ModelOfStudent = Model<Student, Record<string, never>, StudentMethods>;




// Create a custom statics method
export interface ModelOfStudent extends Model<Student> {
  isUserExists(id: string) : Promise<Student | null>
}