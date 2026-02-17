import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import interviewRoutes from "./routes/interview.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/interview", interviewRoutes);

app.listen(5000, () => {
    console.log("ENV KEY:", process.env.GROQ_API_KEY);

  console.log("Server running on port 5000");
});
