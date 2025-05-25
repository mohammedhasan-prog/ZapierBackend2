import { Router } from "express";
import { authmiddleware } from "../middlerwear.js";
import { SignupData, SigninData } from "../types/index.js";
import { client } from "../db/index.js";
import jwt from "jsonwebtoken";
const router = Router();
//@ts-ignore

router.get('/available', async (req,res)=>
{
    const availableTriggers= await client.availableTriggers.findMany({});

    res.status(200).json({
        success:true,
        data:availableTriggers
    })


})
export const triggerRouter=router;
