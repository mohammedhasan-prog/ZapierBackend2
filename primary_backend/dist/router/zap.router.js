"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zapRouter = void 0;
const express_1 = require("express");
const middlerwear_1 = require("../middlerwear");
const router = (0, express_1.Router)();
// @ts-ignore
router.post('/', middlerwear_1.authmiddleware, (req, res) => {
    res.send("Zap route");
});
router.get('/', (req, res) => {
    res.send("Zap get");
});
router.get('/:zapId', (req, res) => {
    res.send("Zap id get");
});
exports.zapRouter = router;
