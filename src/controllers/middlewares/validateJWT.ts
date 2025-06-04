import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../env";
import type { UUID } from "node:crypto";

export const validateJWT = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }

        try {
            const { JWT_SECRET } = env;
            const decoded = jwt.verify(token, JWT_SECRET) as { sub: UUID };

            req.user = { id: decoded.sub };

            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid token" });
        }
    };
};