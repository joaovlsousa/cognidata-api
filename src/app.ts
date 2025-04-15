import express from "express";
//import routes from "./routes";
import cors from "cors";

const app = express();
app.use(cors());
//routes(app);

export default app;