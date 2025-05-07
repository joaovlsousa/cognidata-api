import PrismaTeacherRepository from "../../repositories/prisma/prismaTeacherRepository";
import type { Request, Response } from "express";
import { RegisterTeacherService } from "../../services/registerTeacherService";
import { TeacherAlreadyExistsError } from "../../services/errors/teacherAlreadyExistsError";

export async function registerTeacherController(req: Request, res: Response) {

	const {name, email, password, schoolId} = req.body

	try {
        const usersRepository = new PrismaTeacherRepository();
        const registerService = new RegisterTeacherService(usersRepository);

		await registerService.execute({
			name,
			email,
			password,
            schoolId,

		});

	} catch (error) {
        if (error instanceof TeacherAlreadyExistsError) {
            return res.status(409).json({ message: error.message });
        }
        return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(201).json({ message: "User registered successfully" });
}
