import express from "express";
import routes from "./controllers/index";
import cors from "cors";

const app = express();
app.use(cors());
routes(app);

export default app;