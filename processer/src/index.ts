import { PrismaClient } from "@prisma/client";
import { Kafka } from "kafkajs";

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const TOPIC_NAME = "zap-events";

const client = new PrismaClient();
async function main() {
  const producer = kafka.producer();
  await producer.connect();

  while (1) {
    const pendingRow = await client.zapRunOutbox.findMany({
      where: {},
      take: 10,
    });

    producer.send({
      topic: TOPIC_NAME,
      messages: pendingRow.map((r) => ({
        key: r.zapRunId,
        value: JSON.stringify(r),
      })),
    });

    await client.zapRunOutbox.deleteMany({
      where: {
        id: { in: pendingRow.map((r) => r.id) },
      },
    });
  }
}

main();
