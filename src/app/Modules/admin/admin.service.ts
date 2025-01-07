

// ========= route -> controller -> service ==========
import mongoose from 'mongoose';
import AppError from '../../error/AppError';
import { UserModel } from '../user/user.model';
import { FacultyModel } from './admin.model';
import { TFaculty } from './admin.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllFacultysFronDB = async () => {
  const res = await FacultyModel.find()
  return res;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await FacultyModel.findById( id )
  return result;
};

const searchFacultyFromDB = async (query: Record<string, unknown>) => {
  const facultySearchbleField = ['email', 'name.firstName', 'designation'];

  const facultyQuery = new QueryBuilder(
    FacultyModel.find(),
    query
  )
    .search(facultySearchbleField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await facultyQuery.modelQuery;

  return result;
};


const updateFacultyInDB = async (id: string, payload: Partial<TFaculty>) => {
  const { name, ...remainingFacultytData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultytData,
  };

  if (name && Object.keys(name).length) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await FacultyModel.findByIdAndUpdate(
     id,
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );
  return result;
};

// ===== transaction & rollback ====
const deleteFacultyFromDB = async (id: string) => {
  const isIdExists = await FacultyModel.findById(id);

  if (!isIdExists) {
    throw new AppError(400, 'This Faculty dose not exists');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteFacultyt = await FacultyModel.findByIdAndUpdate(
       id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteFacultyt) {
      throw new AppError(400, 'Faild to delete Facultyt');
    }

    const userId = deleteFacultyt.user;

    const deleteUser = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteUser) {
      throw new AppError(400, 'Faild to delete User');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteFacultyt;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

export const FacultyServices = {
  getAllFacultysFronDB,
  getSingleFacultyFromDB,
  searchFacultyFromDB,
  updateFacultyInDB,
  deleteFacultyFromDB,
};
