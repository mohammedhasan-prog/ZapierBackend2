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
const client_1 = require("@prisma/client");
const kafkajs_1 = require("kafkajs");
const kafka = new kafkajs_1.Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});
const TOPIC_NAME = "zap-events";
const client = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const producer = kafka.producer();
        yield producer.connect();
        while (1) {
            const pendingRow = yield client.zapRunOutbox.findMany({
                where: {},
                take: 10,
            });
            if (pendingRow.length != 0) {
                console.log("Pending rows found:", pendingRow);
            }
            producer.send({
                topic: TOPIC_NAME,
                messages: pendingRow.map((r) => {
                    return {
                        value: JSON.stringify({
                            zapRunId: r.zapRunId,
                            stage: 0
                        }),
                    };
                }),
            });
            yield client.zapRunOutbox.deleteMany({
                where: {
                    id: { in: pendingRow.map((r) => r.id) },
                },
            });
        }
    });
}
main();
