import { model, Schema } from 'mongoose';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { semesterRegestrationStatus } from './semesterRegistration.constent';

const SemesterRegestrationSchema = new Schema<TSemesterRegistration>({
  academicSemester: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: 'AcademicSemester',
  },
  status: {
    type: String,
    enum: semesterRegestrationStatus,
    default: 'UPCOMING',
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  mainCredit: { type: Number, default: 3 },
  maxCredit: { type: Number, default: 15 },
});

export const SemesterRegistrationModel = model<TSemesterRegistration>(
  'SemesterRegestration',
  SemesterRegestrationSchema,
);
