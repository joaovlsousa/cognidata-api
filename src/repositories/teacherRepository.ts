import { UUID } from "crypto";
import { prisma } from "../lib/prisma";

class TeacherRepository {

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

  async createTeacher(data: any) {
    return await prisma.teacher.create({
      data,
    });
  }

  async updateTeacher(id: UUID, data: any) {
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

export default TeacherRepository;
