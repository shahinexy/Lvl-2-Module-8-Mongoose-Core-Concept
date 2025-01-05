// ========= route -> controller -> service ==========
import mongoose from 'mongoose';
import { StudentModle } from './student.model';
import AppError from '../../error/AppError';
import { UserModel } from '../user/user.model';
import { Student } from './student.interface';
import QueryBuilder from '../../builder/QueryBuilder';

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
  const result = await StudentModle.findOne({ id }).populate({
    path: 'academicDepartment',
    populate: {
      path: 'academicFaculty',
    },
  });
  return result;
};

const searchStudentFromDB = async (query: Record<string, unknown>) => {
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

  const result = await studentQuery.modelQuery;

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
