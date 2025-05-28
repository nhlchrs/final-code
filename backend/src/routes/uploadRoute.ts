import express, { Request, Response, Router } from "express";
import multer from "multer";
import {authUser} from "../utils/authUser"
import { getAllFiles, getFileById, uploadFile,deleteFileById } from "../controllers/uploadController";

const route: Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

route.post("/upload", upload.single("file"), authUser ,uploadFile);
route.get("/files", authUser, getAllFiles);
route.post("/files", authUser, getFileById);
route.delete("/files", authUser, deleteFileById);

export default route;
