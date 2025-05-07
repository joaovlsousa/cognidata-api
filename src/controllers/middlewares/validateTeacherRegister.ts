import {z} from 'zod';
import { NextFunction, Request, Response } from 'express';

const teacherSchema = z.object({
    name: z.string().min(1).refine((val) => val.trim() !== "", {
        message: "Name cannot be empty or contain only spaces",
    }),
    password: z.string()
    .min(6)
    .refine((val) => !val.includes(" "), {
        message: "Password cannot contain spaces",
    }),
    email: z.string().email(),
    schoolId: z.string(),
})

export const validateTeacher = (req: Request, res: Response, next: NextFunction) => {
    const result = teacherSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }
    next();
}