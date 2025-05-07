import { UUID } from "crypto";
import { prisma } from "../../lib/prisma";
import type { TeacherRepository } from "../teacherRepository";
import { Prisma } from "@prisma/client";

class PrismaTeacherRepository implements TeacherRepository {

  async getAllTeachers() {
    return await prisma.teacher.findMany();
  }

  async getTeacherById(id: UUID) {
    return await prisma.teacher.findUnique({
      where: { id },
    });
  }

  async getTeacherByEmail(email: string) {
    return await prisma.teacher.findUnique({
      where: { email },
    });
  }

  async createTeacher(data: Prisma.TeacherCreateInput) {
    return await prisma.teacher.create({
      data,
    });
  }

  async updateTeacher(id: UUID, data: Prisma.TeacherUpdateInput) {
    return await prisma.teacher.update({
      where: { id },
      data,
    });
  }

  async deleteTeacher(id: UUID) {
    return await prisma.teacher.delete({
      where: { id },
    });
  }
}

export default PrismaTeacherRepository;
