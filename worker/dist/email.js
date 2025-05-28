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
exports.sendEmail = sendEmail;
const node_mailjet_1 = require("node-mailjet");
// const transporter = nodemailer.createTransport({
//   host: "test-p7kx4xwmkz2g9yjr.mlsender.net",
//   port: 587,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: process.env.SMTP_USERNAME,
//     pass: process.env.SMTP_PASSWORD, 
//   },
// });
function sendEmail(to, body) {
    return __awaiter(this, void 0, void 0, function* () {
        const mailjet = new node_mailjet_1.Client({
            apiKey: "f1e2cbcf445de14c244c0e0a75197d3b",
            apiSecret: "544c3e47533fba5f13a8c34a2c25b9df"
        });
        (() => __awaiter(this, void 0, void 0, function* () {
            const data = {
                Messages: [
                    {
                        From: {
                            Email: 'hasanalipali2@gmail.com',
                            Name: 'Mailjet Pilot',
                        },
                        To: [
                            {
                                Email: to,
                            },
                        ],
                        Subject: 'Your email flight plan!',
                        HTMLPart: `<h3>${body}</h3>`
                    },
                ],
            };
            const result = yield mailjet
                .post('send', { version: 'v3.1' })
                .request(data);
            const { Status } = result.body.Messages[0];
        }))();
    });
}
// f1e2cbcf445de14c244c0e0a75197d3b
// 544c3e47533fba5f13a8c34a2c25b9df
