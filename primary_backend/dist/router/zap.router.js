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
exports.zapRouter = void 0;
const express_1 = require("express");
const middlerwear_1 = require("../middlerwear");
const types_1 = require("../types");
const index_js_1 = require("../db/index.js");
const cuid2_1 = require("@paralleldrive/cuid2"); // Use a CUID generator
const router = (0, express_1.Router)();
//@ts-ignore
router.post("/", middlerwear_1.authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const parsedData = types_1.ZapCreateSchema.safeParse(req.body);
    if (!parsedData.success) {
        return res.status(400).json({ error: parsedData.error.errors });
    }
    try {
        //@ts-ignore
        const zapId1 = yield index_js_1.client.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            const zapId = (0, cuid2_1.createId)(); // Generate Zap ID upfront
            const triggerId = (0, cuid2_1.createId)();
            // Generate User ID upfront
            // Generate Trigerd ID upfront
            // Create Zap with the correct triggerId
            const zap = yield tx.zap.create({
                data: {
                    id: zapId,
                    userId: id, // Use the authenticated user's ID
                    triggerId: triggerId, // Set to pre-generated Trigerd ID
                    actions: {
                        create: parsedData.data.actions.map((x, index) => ({
                            actoinId: x.availableactionId, // Corrected field name (actoinId)
                            sortingOrder: index,
                        })),
                    },
                },
            });
            // Create Trigerd with references to Zap and AvailableTriggers
            yield tx.trigerd.create({
                data: {
                    id: triggerId, // Use pre-generated ID
                    triggerId: parsedData.data.avilableTriggerId, // Corrected variable name
                    zapId: zapId,
                },
            });
            return zap.id;
        }));
        return res.status(201).json({ message: "Zap created successfully",
            zapId: zapId1, // Return the generated Zap ID
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}));
//@ts-ignore
router.get("/", middlerwear_1.authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const zaps = yield index_js_1.client.zap.findMany({
        where: {
            userId: id,
        },
        include: {
            actions: {
                include: {
                    type: true,
                },
            },
            trigger: {
                include: {
                    type: true,
                },
            },
        },
    });
    return res.status(200).json(zaps);
    //@ts-ignore
}));
//@ts-ignore
router.get("/:zapId", middlerwear_1.authmiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;
    const zap = yield index_js_1.client.zap.findUnique({
        where: {
            id: zapId,
            userId: id
        },
        include: {
            actions: {
                include: {
                    type: true,
                },
            },
            trigger: {
                include: {
                    type: true,
                },
            },
        },
    });
    if (!zap) {
        return res.status(404).json({ error: "Zap not found" });
    }
    if (zap.userId !== id) {
        return res.status(403).json({ error: "Forbidden" });
    }
    return res.status(200).json(zap);
}));
exports.zapRouter = router;
