import mongoose, { Document, Schema, Model, Types } from "mongoose";

export interface IFile extends Document {
  name: string;
  type: string;
  contents: any[];
  userId: Types.ObjectId;
}

const fileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  contents: { type: [Schema.Types.Mixed], required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, 
});

const FileModel: Model<IFile> = mongoose.model<IFile>("File", fileSchema);

export default FileModel;
