"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZapCreateSchema = exports.SigninData = exports.SignupData = void 0;
const zod_1 = __importDefault(require("zod"));
exports.SignupData = zod_1.default.object({
    email: zod_1.default.string().email({ message: 'Email is required' }),
    password: zod_1.default.string().min(6, { message: 'Password is required' }),
    name: zod_1.default.string()
});
exports.SigninData = zod_1.default.object({
    email: zod_1.default.string().email({ message: 'Email is required' }),
    password: zod_1.default.string().min(6, { message: 'Password is required' }),
});
exports.ZapCreateSchema = zod_1.default.object({
    avilableTriggerId: zod_1.default.string(),
    triggerMeta: zod_1.default.any().optional(),
    actions: zod_1.default.array(zod_1.default.object({
        availableactionId: zod_1.default.string(),
        actionMeta: zod_1.default.any().optional(),
    })),
});
