"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authmiddleware = authmiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function authmiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    //@ts-ignore
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!payload) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    //@ts-ignore
    req.id = payload.id;
    next();
}
