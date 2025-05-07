import type { Teacher, Prisma } from "@prisma/client";
import type { UUID } from "node:crypto";

export interface TeacherRepository {
    getAllTeachers(): Promise<Teacher[]>;
    getTeacherById(id: UUID): Promise<Teacher | null>;
    getTeacherByEmail(email: string): Promise<Teacher | null>;
    createTeacher(data: Prisma.TeacherCreateInput): Promise<Teacher>;
    updateTeacher(id: UUID, data: Prisma.TeacherUpdateInput): Promise<Teacher>;
    deleteTeacher(id: UUID): Promise<Teacher>;
}