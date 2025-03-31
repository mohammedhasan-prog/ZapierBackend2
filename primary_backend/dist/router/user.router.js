"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const middlerwear_js_1 = require("../middlerwear.js");
const index_js_1 = require("../types/index.js");
const index_js_2 = require("../db/index.js");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
//@ts-ignore
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password, name } = req.body;
    const result = index_js_1.SignupData.safeParse({ email, password, name });
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
    }
    const userExists = yield index_js_2.client.user.findUnique({
        where: {
            email: email,
        },
    });
    if (userExists) {
        return res.status(400).json({ error: "User already exists" });
    }
    const user = yield index_js_2.client.user.create({
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
}));
//@ts-ignore
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const result = index_js_1.SigninData.safeParse({ email, password });
    if (!result.success) {
        return res.status(400).json({ error: result.error.errors });
    }
    const user = yield index_js_2.client.user.findUnique({
        where: {
            email: result.data.email,
        },
    });
    if (!user) {
        return res.status(400).json({ error: "User not found" });
    }
    //@ts-ignore
    const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
    if (user.password !== result.data.password) {
        return res.status(400).json({ error: "Invalid password" });
    }
    res.status(200).json({
        success: true,
        data: user,
        token,
    });
}));
//@ts-ignore
router.get("/", middlerwear_js_1.authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const id = req.id;
    const user = yield index_js_2.client.user.findFirst({
        where: {
            id: id
        }, select: {
            email: true,
            name: true
        }
    });
    res.status(200).json({
        user
    });
}));
exports.userRouter = router;
