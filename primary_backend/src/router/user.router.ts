import { Router } from "express";
import { authmiddleware } from "../middlerwear.js";
import { SignupData, SigninData } from "../types/index.js";
import { client } from "../db/index.js";
import jwt from "jsonwebtoken";
const router = Router();
//@ts-ignore
router.post("/signup", async (req, res) => {
  try { // Debug: Added try-catch to catch crash
    console.log("Processing signup for:", req.body.email);
    const { email, password, name } = req.body;
    const result = SignupData.safeParse({ email, password, name });

    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }

    const userExists = await client.user.findUnique({
      where: {
        email: email,
      },
    });
    if (userExists) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await client.user.create({
      data: {
        email: result.data.email,
        password: result.data.password,
        name: result.data.name,
      },
    });
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (e: any) {
    console.error("Signup Error (CRASH PREVENTION):", e);
    res.status(500).json({ error: "Internal Server Error", details: e.message });
  }
});
//@ts-ignore
router.post("/signin", async (req, res) => {
  try { // Debug: Added try-catch
    const { email, password } = req.body;
    console.log("Processing signin for:", email);
    
    const result = SigninData.safeParse({ email, password });
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    
    const user = await client.user.findUnique({
      where: {
        email: result.data.email,
      },
    });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    
    if (user.password !== result.data.password) {
      return res.status(400).json({ error: "Invalid password" });
    }

    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    //@ts-ignore
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      data: user,
      token,
    });
  } catch (e: any) {
    console.error("Signin Error (CRASH PREVENTION):", e);
    res.status(500).json({ error: "Internal Server Error", details: e.message });
  }
});
//@ts-ignore

router.get("/", authmiddleware,async  (req, res) => {
    // @ts-ignore

    const id = req.id;
    const user =await client.user.findFirst({
        where:{
            id:id
        },select:{
            id: true,
            email:true,
            name:true}
    
    });
    res.status(200).json({
        user
    })
});

export const userRouter = router;
