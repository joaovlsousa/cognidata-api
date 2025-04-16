import {z} from 'zod';
import { NextFunction, Request, Response } from 'express';

const teacherSchema = z.object({
    name: z.string().min(1),
    password: z.string().min(6),
    email: z.string().email(),
    schoolId: z.number().int().positive(),
})

export const validateTeacher = (req: Request, res: Response, next: NextFunction) => {
    const result = teacherSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }
    next();
}