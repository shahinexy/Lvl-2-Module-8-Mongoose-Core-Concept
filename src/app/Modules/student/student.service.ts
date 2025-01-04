// ========= route -> controller -> service ==========
import mongoose from 'mongoose';
import { StudentModle } from './student.model';
import AppError from '../../error/AppError';
import { UserModel } from '../user/user.model';
import { Student } from './student.interface';

const getAllStudentsFronDB = async () => {
  const res = await StudentModle.find()
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return res;
};

const getSingleStudentFromDB = async (id: string) => {
  // const result = await StudentModle.findOne({id})

  const result = await StudentModle.findOne({ id }).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
    },
  });
  return result;
};

const searchStudentFromDB = async (query: Record<string, unknown>) =>{
  let searchTerm = '';
  if(query?.searchTerm){
    searchTerm = query?.searchTerm as string;
  }

  const result = await StudentModle.find({
    $or: ['email', 'name.firstName', 'address'].map((field)=>({
      [field]: {$regex: searchTerm, $options: 'i'}
    }))
  })

  return result;

}

const updateStudentInDb = async (id: string, payload: Partial<Student>) => {
  const { name, gurdian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (gurdian && Object.keys(gurdian).length) {
    for (const [key, value] of Object.entries(gurdian)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await StudentModle.findOneAndUpdate(
    { id: id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

// ===== transaction & rollback ====
const deleteStudentFromDB = async (id: string) => {
  const isIdExists = await StudentModle.findOne({ id: id });

  if (!isIdExists) {
    throw new AppError(400, 'This user dose not exists');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteStudent = await StudentModle.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteStudent) {
      throw new AppError(400, 'Faild to delete student');
    }

    const deleteUser = await UserModel.findOneAndUpdate(
      { id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteUser) {
      throw new AppError(400, 'Faild to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error('Faild to delete student');
  }
};

export const StudentServices = {
  getAllStudentsFronDB,
  getSingleStudentFromDB,
  searchStudentFromDB,
  updateStudentInDb,
  deleteStudentFromDB,
};
