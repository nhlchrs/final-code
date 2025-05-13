import express, { Application } from "express";
import mainRoute from "./routes/mainRoute";
import { connectDB } from "./database/connectDB"; 
import dotenv from "dotenv";
import cors from "cors"
const app: Application = express();

dotenv.config()

const allowedOrigins = ["http://localhost:3000", "https://assignment-frontend-puce.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

connectDB()
app.use(express.json());
app.use("/api", mainRoute);
app.get("/", (req, res) => {
  res.send("Server is up");
});
app.listen(process.env.PORT, () => {
  console.log("Server is running on port 5000");
});