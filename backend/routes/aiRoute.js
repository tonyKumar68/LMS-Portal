import express from "express";
import { chat, search } from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", chat);
router.post("/search", search);

export default router;
