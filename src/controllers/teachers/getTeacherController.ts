
import PrismaTeacherRepository from "../../repositories/prisma/prismaTeacherRepository";
import type { Request, Response } from "express";
import { GetAllTeacherService } from "../../services/getTeacherService";


export async function getAllTeacherController(req: Request, res: Response) {
    try {
        const usersRepository = new PrismaTeacherRepository();
        const registerService = new GetAllTeacherService(usersRepository);

        const { teacher } = await registerService.execute();
        return res.status(200).json(teacher);

    }catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

}
