import QueryBuilder from '../../builder/QueryBuilder';
import { TAcademicDepartment } from './academicDepartment.interface';
import { AcademicDepartmentModel } from './academicDepartment.model';

const createAcademicDepartmentInDB = async (payload: TAcademicDepartment) => {
  const result = await AcademicDepartmentModel.create(payload);
  return result;
};

const getAllAcademicDepartmentFromDB = async (query: Record<string, unknown>) => {

  const academicDepartmenQuery = new QueryBuilder(
    AcademicDepartmentModel.find().populate('academicFaculty'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicDepartmenQuery.modelQuery;
  const meta = await academicDepartmenQuery.cuntTotal();

  return {meta,result};
};

const getSingleAcademicDepartmentFromDB = async (id: string) => {
  const result = await AcademicDepartmentModel.findOne({ _id: id }).populate('academicFaculty');
  return result;
};

const updateSingleAcademicDepartmentFromDB = async (
  id: string,
  payload: Partial<TAcademicDepartment>,
) => {
  const result = await AcademicDepartmentModel.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true },
  );
  return result;
};

export const AcademicDepartmentServices = {
  createAcademicDepartmentInDB,
  getAllAcademicDepartmentFromDB,
  getSingleAcademicDepartmentFromDB,
  updateSingleAcademicDepartmentFromDB,
};
