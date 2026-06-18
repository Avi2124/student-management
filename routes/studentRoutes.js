import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { createStudent, deleteStudent, getStudents, updateStudent } from "../controllers/studentController.js";

const studentRouter = express.Router();
studentRouter.get("/", authMiddleware, getStudents);
studentRouter.post("/", authMiddleware, createStudent);
studentRouter.put("/:id", authMiddleware, updateStudent);
studentRouter.delete("/:id", authMiddleware, deleteStudent);
export default studentRouter;
