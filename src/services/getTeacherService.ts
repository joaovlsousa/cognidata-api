import { hash } from "bcryptjs";
import type { Teacher } from "@prisma/client";
import type TeacherRepository from "../repositories/prisma/prismaTeacherRepository";
import { TeacherNotFoundError } from "../services/errors/teacherNotFoundError";


interface GetAllTeacherServiceResponse {
    teacher: Teacher[];
}

export class GetAllTeacherService {
    constructor(private teacherRepository: TeacherRepository) { }

    async execute(): Promise<GetAllTeacherServiceResponse> {
        const teachers = await this.teacherRepository.getAllTeachers();
        if (!teachers) {
            throw new TeacherNotFoundError;
        }

        return { teacher: teachers };

    }
}