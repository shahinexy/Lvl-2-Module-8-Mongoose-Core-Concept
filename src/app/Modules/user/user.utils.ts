import { TAcademicSemester } from '../academicSemester/academicSemester.inferface';
import { UserModel } from './user.model';

// find last student
const findLastStudentId = async () => {
  const lastStudent = await UserModel.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastStudent?.id ? lastStudent.id : undefined;
};

export const GenaretStudentId = async (payload: TAcademicSemester) => {
  // first time 0000

  let currentId = (0).toString();

  const lastStudentId = await findLastStudentId();

  // 2025010001  last student ID
  const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
  const lastStudentSemesterYser = lastStudentId?.substring(0, 4);

  const currentSemesterCode = payload.code;
  const currentSemesterYear = payload.year;

  if (
    lastStudentId &&
    lastStudentSemesterCode === currentSemesterCode &&
    lastStudentSemesterYser === currentSemesterYear
  ) {
    currentId = lastStudentId.substring(6);
  }

  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');

  incrementId = `${payload.year}${payload.code}${incrementId}`;

  return incrementId;
};

// Genaret Faculty ID
const findLastFacultyId = async () => {
  const lastFaculty = await UserModel.findOne(
    {
      role: 'faculty',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();

  return lastFaculty?.id ? lastFaculty.id.substring(2) : undefined;
};


export const GenaretFacultyId = async()=>{
    let currentId = (0).toString();

    const lastFacultyId = await findLastFacultyId()
    if(lastFacultyId){
      currentId = lastFacultyId ;
    }

    let increment = (Number(currentId)+1).toString().padStart(4,'0');

    increment = `F-${increment}`

    return increment;
}