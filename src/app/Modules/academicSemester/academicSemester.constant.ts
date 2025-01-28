import {
  TAcademicSemesterCode,
  TAcademicSemesterName,
  TMonths,
  TsemesterNameCodeMapper,
} from './academicSemester.inferface';

export const Months: TMonths[] = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const AcademicSemesterSchemaName: TAcademicSemesterName[] = [
  'Autumn',
  'Summer',
  'Fall',
];

export const AcademicSemesterSchemaCode: TAcademicSemesterCode[] = [
  '01',
  '02',
  '03',
];

export const semesterNameCodeMapper: TsemesterNameCodeMapper = {
  Autumn: '01',
  Summer: '02',
  Fall: '03',
};
