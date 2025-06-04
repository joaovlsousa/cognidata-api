
import PrismaTeacherRepository from "../../repositories/prisma/prismaTeacherRepository";
import type { Request, Response } from "express";
import { GetTeacherByIdService } from "../../services/getTeacherByIdService";
import type { UUID } from "node:crypto";
import { TeacherNotFoundError } from "../../services/errors/teacherNotFoundError";


export async function getTeacherByIdController(req: Request, res: Response) {
    const id = req.params.id as UUID;

    try {
        const usersRepository = new PrismaTeacherRepository();
        const getTeacherByIdService = new GetTeacherByIdService(usersRepository);

        const teacher = await getTeacherByIdService.execute({ id });
        return res.status(200).json(teacher);
    }
    catch (error) {
        if (error instanceof TeacherNotFoundError) {
            return res.status(404).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
