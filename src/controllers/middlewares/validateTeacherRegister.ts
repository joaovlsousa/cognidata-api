import {z} from 'zod';
import type { NextFunction, Request, Response } from 'express';

const teacherSchema = z.object({
    name: z.string().min(1).refine((val) => val.trim() !== "", {
        message: "Name cannot be empty or contain only spaces",
    }),
    password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    email: z.string().email(),
    schoolId: z.string(),
}).strict();

export const validateTeacher = (req: Request, res: Response, next: NextFunction) => {
    const result = teacherSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }
    next();
}