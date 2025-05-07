import type { TeacherRepository } from "../repositories/teacherRepository";
import { InvalidCredentialsError } from "./errors/invalidCredentialsError";
import { hash, compare } from "bcryptjs";
import type { Teacher } from "@prisma/client";

interface AuthenticateRequest {
	email: string;
	password: string;
}

interface AuthenticateResponse {
	user: Teacher;
}

export class AuthenticateTeacherService {
	constructor(private userRepository: TeacherRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateRequest): Promise<AuthenticateResponse> {
		const user = await this.userRepository.getTeacherByEmail(email);

		if (!user) {
			throw new InvalidCredentialsError();
		}

		const doesPasswordMatch = await compare(password, user.password);

		if (!doesPasswordMatch) {
			throw new InvalidCredentialsError();
		}

		return {
			user,
		};
	}
}
