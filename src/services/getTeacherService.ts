import { hash } from "bcryptjs";
import { Teacher } from "@prisma/client";
import TeacherRepository from "../repositories/prisma/prismaTeacherRepository";
import { TeacherNotFoundError } from "../services/errors/teacherNotFoundError";

interface GetAllTeacherServiceRequest {

};

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