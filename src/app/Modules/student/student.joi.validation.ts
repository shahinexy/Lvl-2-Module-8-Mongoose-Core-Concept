import Joi from 'joi';

const userNameSchema = Joi.object({
  firstName: Joi.string()
    .max(20)
    .trim()
    .regex(/^[A-Z][a-z]*$/)
    .messages({
      'string.pattern.base': '"{#label}" must be capitalized',
      'string.max': '"{#label}" cannot exceed 20 characters',
    })
    .required()
    .label('First Name'),

  middleName: Joi.string().trim().optional(),

  lastName: Joi.string()
    .trim()
    .regex(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base':
        '"{#label}" must contain only alphabetic characters',
    })
    .label('Last Name'),
});

// Sub-schema for Gurdian
const gurdianSchema = Joi.object({
  fatherName: Joi.string().trim().required().label('Father Name'),
  fatherOccupation: Joi.string().trim().required().label('Father Occupation'),
  fatherContactNo: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': '"{#label}" must be a valid phone number',
    })
    .label('Father Contact Number'),
  motherName: Joi.string().trim().required().label('Mother Name'),
  motherOccupation: Joi.string().trim().required().label('Mother Occupation'),
  motherContactNo: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      'string.pattern.base': '"{#label}" must be a valid phone number',
    })
    .label('Mother Contact Number'),
});

// Main schema for Student
const studentSchema = Joi.object({
  id: Joi.string().trim().required().label('ID'),
  name: userNameSchema.required().label('Name'),
  gender: Joi.string()
    .valid('female', 'male')
    .required()
    .messages({
      'any.only': '"{#label}" must be one of [female, male]',
    })
    .label('Gender'),
  dateOfBirth: Joi.string().isoDate().optional().label('Date of Birth'),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': '"{#label}" must be a valid email',
    })
    .label('Email'),
  contactNo: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .optional()
    .messages({
      'string.pattern.base': '"{#label}" must be a valid phone number',
    })
    .label('Contact Number'),
  bloodGroup: Joi.string()
    .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
    .optional()
    .messages({
      'any.only': '"{#label}" must be a valid blood group',
    })
    .label('Blood Group'),
  address: Joi.string().trim().required().label('Address'),
  gurdian: gurdianSchema.required().label('Gurdian'),
  profileImg: Joi.string().uri().optional().label('Profile Image'),
  isActive: Joi.string()
    .valid('active', 'blocked')
    .default('active')
    .messages({
      'any.only': '"{#label}" must be one of [active, blocked]',
    })
    .label('Is Active'),
});

export default studentSchema;
