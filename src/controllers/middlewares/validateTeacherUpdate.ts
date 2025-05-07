import { z } from "zod";
import { NextFunction, Request, Response } from "express";

const teacherUpdateSchema = z.object({
    name: z.string().min(1).optional().refine((val) => val?.trim() !== "", {
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
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .optional(),
    email: z.string().email().optional(),
    schoolId: z.string().optional(),
});

export const validateTeacherUpdate = (req: Request, res: Response, next: NextFunction) => {
    const result = teacherUpdateSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({ errors: result.error.errors });
    }

    const hasAtLeastOneField = Object.keys(req.body).some((key) =>
        ["name", "password", "email", "schoolId"].includes(key)
    );

    if (!hasAtLeastOneField) {
        return res.status(400).json({ message: "At least one field must be updated" });
    }

    next();
};