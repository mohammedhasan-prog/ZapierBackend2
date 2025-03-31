
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export function authmiddleware(req:Request, res:Response, next:NextFunction) {
    const token = req.headers.authorization
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    //@ts-ignore
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    //@ts-ignore
    

    req.id = payload.id;


    next();
}