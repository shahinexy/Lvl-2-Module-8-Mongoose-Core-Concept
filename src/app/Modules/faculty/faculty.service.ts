

// ========= route -> controller -> service ==========
import mongoose from 'mongoose';
import AppError from '../../error/AppError';
import { UserModel } from '../user/user.model';
import { FacultyModel } from './faculty.model';
import { TFaculty } from './faculty.interface';
// import { TFaculty } from './faculty.interface';

const getAllFacultysFronDB = async () => {
  const res = await FacultyModel.find()
  return res;
};

const getSingleFacultyFromDB = async (id: string) => {
  const result = await FacultyModel.findById( id )
  return result;
};

const searchFacultyFromDB = async (query: Record<string, unknown>) => {
  // console.log('base quesry', query);

  // const queryObject = { ...query };

  // // == Search ==
//   const facultySearchbleField = ['email', 'name.firstName', 'address'];

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

//   const FacultytQuery = new QueryBuilder(
//     FacultytModle.find()
//       .populate('admissionSemester')
//       .populate({
//         path: 'academicDepartment',
//         populate: {
//           path: 'academicFaculty',
//         },
//       }),
//     query,
//   )
//     .search(FacultytSearchbleField)
//     .filter()
//     .sort()
//     .paginate()
//     .fields();

//   const result = await FacultytQuery.modelQuery;

//   return result;
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
