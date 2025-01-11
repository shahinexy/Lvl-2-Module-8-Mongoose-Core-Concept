import { z } from "zod";

const loginUserValidationSchema = z.object({
    body: z.object({
        id: z.string({invalid_type_error: 'Id is requierd'}),
        password: z.string({invalid_type_error: 'Password id required'})
    })
})

export const AuthValidations = {
    loginUserValidationSchema
}