"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_router_js_1 = require("./router/user.router.js");
const zap_router_js_1 = require("./router/zap.router.js");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/api/v1/user', user_router_js_1.userRouter);
app.use('/api/v1/zap', zap_router_js_1.zapRouter);
// app.post('/user/signup', (req, res) => {});
// app.post('/user/signin', (req, res) => {});
// app.post('/zap/signin', (req, res) => {});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
