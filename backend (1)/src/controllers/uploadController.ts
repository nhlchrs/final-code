import { Response } from "express";
import xlsx from "xlsx";
import path from "path";
import FileModel from "../models/files.modals";
import { AuthenticatedRequest } from "../types/express";

export const uploadFile = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    if (!req.user || !req.user.id) {
      res.status(401).json({ error: "Unauthorized: user not found" });
      return;
    }

    const fileName = req.file.originalname;
    const fileType = path.extname(fileName).toLowerCase();

    let workbook;
    if (fileType === ".csv") {
      const csvContent = req.file.buffer.toString("utf-8");
      workbook = xlsx.read(csvContent, { type: "string" });
    } else {
      workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    }

    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    const savedFile = new FileModel({
      name: fileName,
      type: fileType,
      contents: data,
      userId: req.user.id,
    });

    await savedFile.save();

    res.status(200).json({
      message: "File uploaded and saved successfully",
      status : 1,
      userId: savedFile._id,
      file: {
        name: savedFile.name,
        type: savedFile.type,
        contents: savedFile.contents,
        userId: savedFile.userId,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "File upload failed please select another file", status : 0, });
  }
};


export const getAllFiles = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ error: "Unauthorized: user not found" });
      return;
    }

    const userFiles = await FileModel.find({ userId: req.user.id }).select("name type");


    res.status(200).json({
      message: "Files fetched successfully",
      status : 1,
      files: userFiles,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ error: "Failed to fetch files" });
  }
};


export const getFileById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { fileId } = req.body;

    if (!req.user || !req.user.id) {
      res.status(401).json({ error: "Unauthorized: user not found" });
      return;
    }

    if (!fileId) {
      res.status(400).json({ error: "Invalid or missing file ID" });
      return;
    }

    const file = await FileModel.findOne({
      _id: fileId,
      userId: req.user.id,
    });

    if (!file) {
      res.status(404).json({ error: "File not found or access denied" });
      return;
    }

    res.status(200).json({
      message: "File retrieved successfully",
      file,
    });
  } catch (error) {
    console.error("Error retrieving file:", error);
    res.status(500).json({ error: "Failed to retrieve file" });
  }
};
export const deleteFileById = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { fileId } = req.body;

    if (!req.user || !req.user.id) {
      res.status(401).json({ error: "Unauthorized: user not found" });
      return;
    }

    if (!fileId) {
      res.status(400).json({ error: "Missing file ID" });
      return;
    }

    const file = await FileModel.findOneAndDelete({
      _id: fileId,
      userId: req.user.id,
    });

    if (!file) {
      res.status(404).json({ error: "File not found or access denied" });
      return;
    }

    res.status(200).json({
      status : 1,
      message: "File deleted successfully",
      deletedFileId: fileId,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Failed to delete file" });
  }
};
