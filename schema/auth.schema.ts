import { z } from 'zod';

const loginSchema = z.object({
    username: z.string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
    }).min(1, 'Username cannot be empty'),
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
    }).min(1, {
        message: 'Password must be at least 1 characters long',
    })
});

export type LoginSchema = z.infer<typeof loginSchema>;
export default loginSchema;