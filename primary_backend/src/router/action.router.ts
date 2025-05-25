import { Router } from "express";
import { authmiddleware } from "../middlerwear.js";
import { SignupData, SigninData } from "../types/index.js";
import { client } from "../db/index.js";
import jwt from "jsonwebtoken";
const router = Router();
router.get('/available', async (req, res) => {
    const availableActions= await client.availableActions.findMany({});

    res.status(200).json({
        success:true,
        data:availableActions
    })

})
//@ts-ignore
export const actionRouter = router;