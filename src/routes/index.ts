import teacherRoutes from "./teacherRoutes";
import express, { Request, Response } from "express";
import { Express } from "express";

const routes = (app: Express) => {
    app
      .route("/")
      .get((req: Request, res: Response) => res.status(200).send("API Node.js"));
    app.use(express.json(), teacherRoutes);
  };
  
  export default routes;