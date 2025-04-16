import { PrismaClient } from "@prisma/client";

class TeacherRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getAllTeachers() {
    return await this.prisma.teacher.findMany();
  }

  async getTeacherById(id: number) {
    return await this.prisma.teacher.findUnique({
      where: { id },
    });
  }

  async createTeacher(data: any) {
    return await this.prisma.teacher.create({
      data,
    });
  }

  async updateTeacher(id: number, data: any) {
    return await this.prisma.teacher.update({
      where: { id },
      data,
    });
  }

  async deleteTeacher(id: number) {
    return await this.prisma.teacher.delete({
      where: { id },
    });
  }
}

export default TeacherRepository;
