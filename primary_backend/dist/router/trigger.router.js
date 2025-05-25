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
Object.defineProperty(exports, "__esModule", { value: true });
exports.triggerRouter = void 0;
const express_1 = require("express");
const index_js_1 = require("../db/index.js");
const router = (0, express_1.Router)();
//@ts-ignore
router.get('/available', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const availableTriggers = yield index_js_1.client.availableTriggers.findMany({});
    res.status(200).json({
        success: true,
        data: availableTriggers
    });
}));
exports.triggerRouter = router;
