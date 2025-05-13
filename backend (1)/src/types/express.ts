import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  file?: Express.Multer.File;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}
