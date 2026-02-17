import express from "express";
import { chatInterview } from "../controllers/interviewController.js";

const router = express.Router();

router.post("/chat", chatInterview);

export default router;
