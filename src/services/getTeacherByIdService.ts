import { hash } from "bcryptjs";
import type { Teacher } from "@prisma/client";
import type TeacherRepository from "../repositories/prisma/prismaTeacherRepository";
import { TeacherNotFoundError } from "../services/errors/teacherNotFoundError";
import type { UUID } from "node:crypto";

interface GetTeacherByIdServiceRequest {
    id: UUID;
};

interface GetTeacherByIdServiceResponse {
    teacher: Teacher;
}

export class GetTeacherByIdService {
    constructor(private teacherRepository: TeacherRepository) {}

    async execute({
        id
    }: GetTeacherByIdServiceRequest): Promise<GetTeacherByIdServiceResponse> {
        const teacher = await this.teacherRepository.getTeacherById(id);

        if (!teacher) {
            throw new TeacherNotFoundError();
        }
        return { teacher };

    }
}