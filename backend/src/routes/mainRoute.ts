import express, { Application } from "express";
import authRoute from "./authRoute";
import uploadRoute from "./uploadRoute";

const app: Application = express();

app.use("/upload", uploadRoute);
app.use("/auth", authRoute);

export default app;
