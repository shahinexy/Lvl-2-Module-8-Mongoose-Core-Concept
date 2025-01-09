import { Types } from "mongoose"

export type TSemesterRegistration ={
    academicSemester: Types.ObjectId;
    status: 'UPCOMING' | 'ONGOING' | 'ENDED';
    startDate: Date;
    endDate: Date;
    mainCredit: number;
    maxCredit: number;
}