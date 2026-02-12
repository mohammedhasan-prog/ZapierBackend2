import { Kafka } from "kafkajs";
import { PrismaClient } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";
import { parseZapData } from "./parser";
import { sendEmail } from "./email";
const TOPIC = "zap-events";
const kafka = new Kafka({
  clientId: "my-app",
  brokers: [process.env.KAFKA_BROKER || "localhost:9092"],
  ssl: !!process.env.KAFKA_USERNAME,
  sasl: process.env.KAFKA_USERNAME ? {
    mechanism: 'scram-sha-256',
    username: process.env.KAFKA_USERNAME,
    password: process.env.KAFKA_PASSWORD || ""
  } : undefined
});
const TOPIC_NAME = "zap-events";

const client = new PrismaClient();

async function main() {
  const consumer = kafka.consumer({ groupId: "test-group" });
  await consumer.connect();
  const producer = kafka.producer();
  await producer.connect();

  await consumer.subscribe({ topic: TOPIC });
"@ts-ignore"
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      console.log("Received message:", {
        partition,
        offset: message.offset,
        value: message?.value?.toString(),
      });
"@ts-ignore"

      const parseValue = JSON.parse(message.value?.toString() || "{}");

      const zapRunId = parseValue.zapRunId;
      const stage = parseValue.stage;

      const zapRunDetails = await client.zapRun.findFirst({
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

      const currentStage = zapRunDetails?.zap.actions.find(
        (a) => a.sortingOrder === stage
      );

      if (!currentStage) {
        console.log("No current stage found, skipping message");
        return;
      }

      if (currentStage.type.id === "email") {
       
        const zapRunMetadata = zapRunDetails?.metadata;
         console.log("Zap Run Metadata:", zapRunMetadata);
          console.log("Current Stage Metadata:", currentStage.metadata );

        const body = parseZapData(
          (currentStage.metadata as JsonObject)?.body as string,
           zapRunMetadata
        );
        console.log("Email body:", body);
        const to = parseZapData(
          (currentStage.metadata as JsonObject)?.to as string,
          zapRunMetadata
        );
         await sendEmail(to, body);

        console.log("Processing email stage with body:", body, "to:", to);
        console.log("Processing email stage");
      }

      if (currentStage.type.id === "sol") {
        console.log("Processing sol stage");
        // const zapRunMetadata = zapRunDetails?.metadata;
         const zapRunMetadata = zapRunDetails?.metadata;
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

      await new Promise((resolve) => setTimeout(resolve, 5000));

      const lastStage = (zapRunDetails?.zap.actions.length || 1) - 1;

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
      await consumer.commitOffsets([
        {
          topic: TOPIC,
          partition,
          offset: (parseInt(message.offset, 10) + 1).toString(),
        },
      ]);
    },
  });
  //   while (1) {}
}

main();
