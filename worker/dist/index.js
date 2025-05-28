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
const kafkajs_1 = require("kafkajs");
const client_1 = require("@prisma/client");
const parser_1 = require("./parser");
const email_1 = require("./email");
const TOPIC = "zap-events";
const kafka = new kafkajs_1.Kafka({
    clientId: "my-app",
    brokers: ["localhost:9092"],
});
const TOPIC_NAME = "zap-events";
const client = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const consumer = kafka.consumer({ groupId: "test-group" });
        yield consumer.connect();
        const producer = kafka.producer();
        yield producer.connect();
        yield consumer.subscribe({ topic: TOPIC });
        "@ts-ignore";
        yield consumer.run({
            autoCommit: false,
            eachMessage: (_a) => __awaiter(this, [_a], void 0, function* ({ topic, partition, message }) {
                var _b, _c, _d, _e;
                console.log("Received message:", {
                    partition,
                    offset: message.offset,
                    value: (_b = message === null || message === void 0 ? void 0 : message.value) === null || _b === void 0 ? void 0 : _b.toString(),
                });
                "@ts-ignore";
                const parseValue = JSON.parse(((_c = message.value) === null || _c === void 0 ? void 0 : _c.toString()) || "{}");
                const zapRunId = parseValue.zapRunId;
                const stage = parseValue.stage;
                const zapRunDetails = yield client.zapRun.findFirst({
                    where: {
                        id: zapRunId,
                    },
                    include: {
                        zap: {
                            include: {
                                actions: {
                                    include: {
                                        type: true,
                                    },
                                },
                            },
                        },
                    },
                });
                const currentStage = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.actions.find((a) => a.sortingOrder === stage);
                if (!currentStage) {
                    console.log("No current stage found, skipping message");
                    return;
                }
                if (currentStage.type.id === "email") {
                    const zapRunMetadata = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.metadata;
                    console.log("Zap Run Metadata:", zapRunMetadata);
                    console.log("Current Stage Metadata:", currentStage.metadata);
                    const body = (0, parser_1.parseZapData)((_d = currentStage.metadata) === null || _d === void 0 ? void 0 : _d.to, zapRunMetadata);
                    console.log("Email body:", body);
                    const to = (0, parser_1.parseZapData)((_e = currentStage.metadata) === null || _e === void 0 ? void 0 : _e.to, zapRunMetadata);
                    yield (0, email_1.sendEmail)(to, body);
                    console.log("Processing email stage with body:", body, "to:", to);
                    console.log("Processing email stage");
                }
                if (currentStage.type.id === "sol") {
                    console.log("Processing sol stage");
                    // const zapRunMetadata = zapRunDetails?.metadata;
                    const zapRunMetadata = zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.metadata;
                    console.log("Zap Run Metadata:", zapRunMetadata);
                    // const amount = parseZapData(
                    //   (currentStage.metadata as JsonObject)?.amount as string,
                    //   zapRunMetadata
                    // );
                    // const adress = parseZapData(
                    //   (currentStage.metadata as JsonObject)?.address as string,
                    //   zapRunMetadata
                    // );
                    // console.log("Processing sol stage with body:", amount, "to:", adress);
                    // Here you can add the logic to process the sol stage
                    // For example, you might want to call a function that handles the sol stage
                }
                yield new Promise((resolve) => setTimeout(resolve, 5000));
                const lastStage = ((zapRunDetails === null || zapRunDetails === void 0 ? void 0 : zapRunDetails.zap.actions.length) || 1) - 1;
                if (lastStage !== stage) {
                    console.log("Sending next stage message to Kafka");
                    producer.send({
                        topic: TOPIC_NAME,
                        messages: [
                            {
                                value: JSON.stringify({
                                    zapRunId: zapRunId,
                                    stage: stage + 1,
                                }),
                            },
                        ],
                    });
                }
                yield consumer.commitOffsets([
                    {
                        topic: TOPIC,
                        partition,
                        offset: (parseInt(message.offset, 10) + 1).toString(),
                    },
                ]);
            }),
        });
        //   while (1) {}
    });
}
main();
