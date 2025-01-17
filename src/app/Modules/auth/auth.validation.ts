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

const refreshTokenValidationSchema = z.object({
    cookies: z.object({
        refreshToken: z.string({invalid_type_error: 'Refresh Token requierd'}),
    })
})

const forgetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({invalid_type_error: 'Id is requierd'}),
    })
})

const resetPasswordValidationSchema = z.object({
    body: z.object({
        id: z.string({invalid_type_error: 'User Id is requierd'}),
        newPassword: z.string({invalid_type_error: 'User password is requierd'}),
    })
})

export const AuthValidations = {
    loginUserValidationSchema,
    changePasswordValidationSchema,
    refreshTokenValidationSchema,
    forgetPasswordValidationSchema,
    resetPasswordValidationSchema
}