import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';

const createSemesterRegestrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  // check if academic semester is exists
  const isAcademicSemisterExists = await AcademicSemesterModel.findById(
    payload.academicSemester,
  );

  if (!isAcademicSemisterExists) {
    throw new AppError(400, 'Academic Semester Not Found');
  }

  // check if semester registetion already registered
  const isSemesterRegistrationExists = await SemesterRegistrationModel.findOne({
    academicSemester: payload.academicSemester,
  });

  if (isSemesterRegistrationExists) {
    throw new AppError(400, 'Semester Already Registered');
  }

  const result = await SemesterRegistrationModel.create(payload);
  return result;
};

const getAllSemesterRegistersFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistrationModel.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

export const semesterRegistrationServices = {
  createSemesterRegestrationIntoDB,
  getAllSemesterRegistersFromDB
};
