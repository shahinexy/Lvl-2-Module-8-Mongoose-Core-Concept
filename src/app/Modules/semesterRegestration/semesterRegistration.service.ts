import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { AcademicSemesterModel } from '../academicSemester/academicSemester.model';
import { RegistrationStatus } from './semesterRegistration.constent';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistrationModel } from './semesterRegistration.model';

const createSemesterRegestrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  // check if there any register semester that is already 'UPCOMING' or 'ONGOING'
  const isThereAnyUpcomingOrOngoingSemester =
    await SemesterRegistrationModel.findOne({
      $or: [
        { status: RegistrationStatus.UPCOMING },
        { status: RegistrationStatus.ONGOING },
      ],
    });

  if (isThereAnyUpcomingOrOngoingSemester) {
    throw new AppError(
      400,
      `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} registered semester`,
    );
  }

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

const getSingleSemesterRegistersFromDB = async (id: string) => {
  const result =
    await SemesterRegistrationModel.findById(id).populate('academicSemester');
  return result;
};

const updateSemesterRegistersFromDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  // check if semester registration exists
  const isSemesterRegistrationExists =
    await SemesterRegistrationModel.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(400, 'Semseter Registration Not Found');
  }

  // check if semester registration ENDED
  const currentSemesterStatus = isSemesterRegistrationExists?.status;
  const requestedStatus = payload?.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(400, 'This Semseter Registration Alreay ENDED');
  }

  // UPCOMING -> ONGOING -> ENDED
  if (
    currentSemesterStatus === RegistrationStatus.UPCOMING &&
    requestedStatus === RegistrationStatus.ENDED
  ) {
    throw new AppError(
      400,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }

  if (
    currentSemesterStatus === RegistrationStatus.ONGOING &&
    requestedStatus === RegistrationStatus.UPCOMING
  ) {
    throw new AppError(
      400,
      `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`,
    );
  }

  const result = await SemesterRegistrationModel.findByIdAndUpdate(
    id,
    payload,
    { new: true },
  );
  return result;
};

export const semesterRegistrationServices = {
  createSemesterRegestrationIntoDB,
  getAllSemesterRegistersFromDB,
  getSingleSemesterRegistersFromDB,
  updateSemesterRegistersFromDB,
};
