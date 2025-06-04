import { hash } from "bcryptjs";
import type { Teacher } from "@prisma/client";
import type TeacherRepository from "../repositories/prisma/prismaTeacherRepository";
import type { UUID } from "node:crypto";
import { TeacherAlreadyExistsError } from "./errors/teacherAlreadyExistsError";
import { TeacherNotFoundError } from "./errors/teacherNotFoundError";

interface UpdateTeacherServiceRequest {
    id: UUID;
    name?: string;
    email?: string;
    password?: string;
    schoolId?: string;
}

interface UpdateTeacherServiceResponse {
    teacher: Teacher;

}

export class UpdateTeacherService {
    constructor(private teacherRepository: TeacherRepository) { }

    async execute({
        id,
        name,
        email,
        password,
        schoolId
    }: UpdateTeacherServiceRequest): Promise<UpdateTeacherServiceResponse> {
        const teacher = await this.teacherRepository.getTeacherById(id);
        if (!teacher) {
            throw new TeacherNotFoundError;
        }

        if (email) {
            const teacherWithSameEmail = await this.teacherRepository.getTeacherByEmail(email);
            if (teacherWithSameEmail && teacherWithSameEmail.id !== id) {
                throw new TeacherAlreadyExistsError;
            }
        }

        const passwordHash = password ? await hash(password, 6) : teacher.password;

        const updatedTeacher = await this.teacherRepository.updateTeacher(id, {
            name,
            email,
            password: passwordHash,
            schoolId,
        });

        return { teacher: updatedTeacher };
    }

}