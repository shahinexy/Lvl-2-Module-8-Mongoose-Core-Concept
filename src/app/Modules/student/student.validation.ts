import { z } from 'zod';

// Zod schema for UserName
const userNameSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(20, { message: 'First name cannot be greater than 20 characters' })
    .transform((value) => value.trim()), // Trims whitespace
  middleName: z
    .string()
    .optional()
    .transform((value) => (value ? value.trim() : value)), // Trims if provided
  lastName: z
    .string()
    .nonempty({ message: 'Last name is required' })
    .refine((value) => /^[A-Za-z]+$/.test(value), {
      message: 'Last name must contain only alphabetic characters',
    })
    .transform((value) => value.trim()), // Trims whitespace
});

// Zod schema for Guardian
const guardianSchema = z.object({
  fatherName: z
    .string()
    .nonempty({ message: 'Father name is required' })
    .transform((value) => value.trim()),
  fatherOccupation: z
    .string()
    .nonempty({ message: 'Father occupation is required' })
    .transform((value) => value.trim()),
  fatherContactNo: z
    .string()
    .nonempty({ message: 'Father contact number is required' })
    .transform((value) => value.trim()),
  motherName: z
    .string()
    .nonempty({ message: 'Mother name is required' })
    .transform((value) => value.trim()),
  motherOccupation: z
    .string()
    .nonempty({ message: 'Mother occupation is required' })
    .transform((value) => value.trim()),
  motherContactNo: z
    .string()
    .nonempty({ message: 'Mother contact number is required' })
    .transform((value) => value.trim()),
});

// Zod schema for Student
const createStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: userNameSchema,
      gender: z.enum(['female', 'male'], {
        errorMap: () => ({ message: 'Gender must be either female or male' }),
      }),
      dateOfBirth: z
        .string()
        .optional()
        .transform((value) => (value ? value.trim() : value)),
      email: z
        .string()
        .nonempty({ message: 'Email is required' })
        .email({ message: 'Invalid email address' })
        .transform((value) => value.trim()),
      contactNo: z
        .string()
        .nonempty({ message: 'Contact number is required' })
        .transform((value) => value.trim()),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      address: z
        .string()
        .nonempty({ message: 'Address is required' })
        .transform((value) => value.trim()),
      emergancyNo: z
        .string()
        .nonempty({ message: 'Emergency number is required' })
        .transform((value) => value.trim()),
      gurdian: guardianSchema,
      profileImg: z
        .string()
        .default('')
        .transform((value) => value.trim()),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
};
