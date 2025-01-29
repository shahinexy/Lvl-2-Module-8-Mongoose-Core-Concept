import QueryBuilder from '../../builder/QueryBuilder';
import { TAcademicFaculty } from './academicFaculty.interface';
import { AcademicFacultyModel } from './academicFaculty.model';

const createAcademicFacultyInDB = async (payload: TAcademicFaculty) => {
  const result = await AcademicFacultyModel.create(payload);
  return result;
};

const getAllAcademicFacultyFromDB = async (query: Record<string, unknown>) => {
  const academicFacultyQuery = new QueryBuilder(
    AcademicFacultyModel.find(),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await academicFacultyQuery.modelQuery;
  const meta = await academicFacultyQuery.cuntTotal();

  return { meta, result };
};

const getSingleAcademicFacultyFromDB = async (id: string) => {
  const result = await AcademicFacultyModel.findOne({ _id: id });
  return result;
};

const updateSingleAcademicFacultyFromDB = async (
  id: string,
  payload: Partial<TAcademicFaculty>,
) => {
  const result = await AcademicFacultyModel.findOneAndUpdate(
    { _id: id },
    { $set: payload },
    { new: true },
  );
  return result;
};

export const AcademicFacultyServices = {
  createAcademicFacultyInDB,
  getAllAcademicFacultyFromDB,
  getSingleAcademicFacultyFromDB,
  updateSingleAcademicFacultyFromDB,
};
