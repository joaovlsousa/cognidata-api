export class TeacherAlreadyExistsError extends Error {
    constructor() {
        super("User already exists.");
        this.name = "UserAlreadyExistsError";
    }
}