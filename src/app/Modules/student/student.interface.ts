import { Schema, model, connect } from 'mongoose';

export type Gurdian ={
    fatherName: string;
    fatherOccupation: string;
    fatherContactNo: string;
    motherName: string;
    motherOccupation: string;
    motherContactNo: string;
  }

export type Student = {
  id: string;
  name: {
    firstName: string;
    middleName: string;
    lastName: string;
  };
  gender: "male" | "female";
  dateOfBirth: string;
  email: string;
  contactNo: string;
  emergancyNo: string;
  bloodGroup?: 'A+'|"A-"|'B+'|'B-'|'AB+'|'AB-'|'O+'|'O-' ;
  address: string;
  gurdian: Gurdian;
};
