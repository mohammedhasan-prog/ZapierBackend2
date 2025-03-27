import { Kafka } from "kafkajs";
const TOPIC = "zap-events";
const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});


async function main() {
  const consumer = kafka.consumer({ groupId: "test-group" });
  await consumer.connect();
  await consumer.subscribe({ topic: TOPIC });

  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
       
      console.log("Received message:", {
        partition,
        offset: message.offset,
        value: message.value.toString(),
      });
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await consumer.commitOffsets([{ topic: TOPIC, partition, offset: (parseInt(message.offset, 10) + 1).toString() }]);
    },
  });
//   while (1) {}
}

main();
