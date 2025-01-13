import { z } from "zod";

const loginUserValidationSchema = z.object({
    body: z.object({
        id: z.string({invalid_type_error: 'Id is requierd'}),
        password: z.string({invalid_type_error: 'Password id required'})
    })
})

const changePasswordValidationSchema = z.object({
    body: z.object({
        oldPassword: z.string({invalid_type_error: 'Old password requierd'}),
        newPassword: z.string({invalid_type_error: 'New password required'})
    })
})

export const AuthValidations = {
    loginUserValidationSchema,
    changePasswordValidationSchema
}