import { TSchedule } from './offeredCourses.interface';

export const hasTimeConflict = (
  assignedShedule: TSchedule[],
  newSchedule: TSchedule,
) => {
  for (const schedule of assignedShedule) {
    const existingStratTime = new Date(`1970-01-01T${schedule.startTime}`);
    const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`);
    const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`);
    const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`);

    if (newStartTime < existingEndTime && newEndTime > existingStratTime) {
      return true;
    }
  }
  return false;
};
