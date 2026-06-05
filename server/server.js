import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import interviewRoutes from "./routes/interview.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/interview", interviewRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend Running 🚀" });
});

// Local development only
if (process.env.NODE_ENV !== "production") {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

export default app;