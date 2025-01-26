/* eslint-disable @typescript-eslint/no-explicit-any */
// ========= route -> controller -> service ==========
import mongoose from 'mongoose';
import { StudentModle } from './student.model';
import AppError from '../../error/AppError';
import { UserModel } from '../user/user.model';
import { Student } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';

const getAllStudentsFronDB = async (query: Record<string, unknown>) => {
  // console.log('base quesry', query);

  // const queryObject = { ...query };

  // // == Search ==
  const studentSearchbleField = ['email', 'name.firstName', 'address'];

  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // const searchQuery = StudentModle.find({
  //   $or: studentSearchbleField.map((field) => ({
  //     [field]: { $regex: searchTerm, $options: 'i' },
  //   })),
  // });

  // // == Filter ==
  // const excludefield = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

  // excludefield.forEach((el) => delete queryObject[el]);
  // console.log({ query, queryObject });

  // const filterQuery = searchQuery.find(queryObject);

  // // Sort
  // let sort = '-createdAt';

  // if (query.sort) {
  //   sort = query.sort as string;
  // }

  // const sortQuery = filterQuery.sort(sort);

  // == Pagination ==
  // let page = 1;
  // let limit = 1;
  // let skip = 1;

  // if (query.limit) {
  //   limit = Number(query.limit);
  // }

  // if(query.page){
  //   page = Number(query.page)
  //   skip = (page-1)*limit
  // }

  // const paginateQuery = sortQuery.skip(skip);

  // const limitQuery =  paginateQuery.limit(limit);

  // // == Field limiting ==
  // let fields = '__v';

  // if(query.fields){
  //   fields = (query.fields as string).split(',').join(' ')
  // }

  // const fiedsQuery = await limitQuery.select(fields)

  // return fiedsQuery;

  const studentQuery = new QueryBuilder(
    StudentModle.find()
      .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchbleField)
    .filter()
    .sort()
    .paginate()
    .fields();

  const meta = await studentQuery.cuntTotal();
  const result = await studentQuery.modelQuery;

  return {
    meta,
    result,
  };
};

const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModle.findById(id).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
    },
  });
  return result;
};

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

  const result = await StudentModle.findByIdAndUpdate(id, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};

// ===== transaction & rollback ====
const deleteStudentFromDB = async (id: string) => {
  const isIdExists = await StudentModle.findById(id);

  if (!isIdExists) {
    throw new AppError(400, 'This user dose not exists');
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const deleteStudent = await StudentModle.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteStudent) {
      throw new AppError(400, 'Faild to delete student');
    }

    const userId = deleteStudent.user;

    const deleteUser = await UserModel.findByIdAndUpdate(
      userId,
      { isDeleted: true },
      { new: true, session },
    );

    if (!deleteUser) {
      throw new AppError(400, 'Faild to delete user');
    }

    await session.commitTransaction();
    await session.endSession();

    return deleteStudent;
  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();

    throw new Error(error);
  }
};

export const StudentServices = {
  getAllStudentsFronDB,
  getSingleStudentFromDB,
  updateStudentInDb,
  deleteStudentFromDB,
};
