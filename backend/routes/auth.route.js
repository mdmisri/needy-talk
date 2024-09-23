import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller.js"; // Ensure this path is correct

const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);


export default router;
