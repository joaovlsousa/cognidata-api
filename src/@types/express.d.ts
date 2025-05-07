import { UUID } from "crypto";
import type { Request } from "express";

declare module "express" {
    export interface Request {
        user?: {
            id: UUID;
        };
    }
}