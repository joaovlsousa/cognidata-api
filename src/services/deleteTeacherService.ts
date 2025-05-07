import { hash } from "bcryptjs";
import { Teacher } from "@prisma/client";
import TeacherRepository from "../repositories/prisma/prismaTeacherRepository";
import { UUID } from "node:crypto";
import { TeacherNotFoundError } from "./errors/teacherNotFoundError";

interface DeleteTeacherServiceRequest {
    id: UUID;
}

interface DeleteTeacherServiceResponse {
    teacher: Teacher;
}

export class DeleteTeacherService {
    constructor(private teacherRepository: TeacherRepository) { }

    async execute({
        id,
    }: DeleteTeacherServiceRequest): Promise<DeleteTeacherServiceResponse> {
        const teacher = await this.teacherRepository.getTeacherById(id);
        if (!teacher) {
            throw new TeacherNotFoundError;
        }

        const deletedTeacher = await this.teacherRepository.deleteTeacher(id);

        return { teacher: deletedTeacher };
    }


}