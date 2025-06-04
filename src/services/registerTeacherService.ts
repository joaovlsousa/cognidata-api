import { hash } from "bcryptjs";
import type { Teacher } from "@prisma/client";
import type TeacherRepository from "../repositories/prisma/prismaTeacherRepository";
import { TeacherAlreadyExistsError } from "./errors/teacherAlreadyExistsError";

interface RegisterTeacherServiceRequest {
    name: string;
    email: string;
    password: string;
    schoolId: string;
}

interface RegisterTeacherServiceResponse {
    teacher: Teacher;
}

export class RegisterTeacherService {
    constructor(private teacherRepository: TeacherRepository) { }

    async execute({
        name,
        email,
        password,
        schoolId
    }: RegisterTeacherServiceRequest): Promise<RegisterTeacherServiceResponse> {
        const passwordHash = await hash(password, 6);

        const teacherWithSameEmail = await this.teacherRepository.getTeacherByEmail(email);
        if (teacherWithSameEmail) {
            throw new TeacherAlreadyExistsError
        }

        const teacher = await this.teacherRepository.createTeacher({
            name,
            password: passwordHash,
            email,
            schoolId,
        });
        return {teacher};
    }
}