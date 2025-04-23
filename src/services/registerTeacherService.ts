import { hash } from "bcryptjs";
import TeacherRepository from "../repositories/teacherRepository";



export class RegisterTeacherService {

    constructor(private teacherRepository: TeacherRepository) {}
    
    async registerTeacher(name: string, password: string, email: string, schoolId: number) {
        const passwordHash = await hash(password, 6);

        const teacherWithSameEmail = await this.teacherRepository.getTeacherByEmail(email);
        if (teacherWithSameEmail) {
            throw new Error("Email already registered");
        }

        const teacher = await this.teacherRepository.createTeacher({
            name,
            password: passwordHash,
            email,
            schoolId,
        });
        return teacher;
    }
}