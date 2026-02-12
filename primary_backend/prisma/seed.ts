
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // Seed Triggers
  await prisma.availableTriggers.upsert({
    where: { id: "webhook" },
    update: {
      image: "https://cdn-icons-png.flaticon.com/512/2885/2885417.png",
    },
    create: {
      id: "webhook",
      name: "Webhook",
      image: "https://cdn-icons-png.flaticon.com/512/2885/2885417.png",
    },
  });

  await prisma.availableTriggers.upsert({
    where: { id: "email" },
    update: {
      image: "https://cdn-icons-png.flaticon.com/512/281/281769.png",
    },
    create: {
      id: "email",
      name: "Email",
      image: "https://cdn-icons-png.flaticon.com/512/281/281769.png",
    },
  });

  await prisma.availableTriggers.upsert({
    where: { id: "gmail" },
    update: {
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968534.png",
    },
    create: {
      id: "gmail",
      name: "Gmail",
      image: "https://cdn-icons-png.flaticon.com/512/5968/5968534.png",
    },
  });

  // Seed Actions
  await prisma.availableActions.upsert({
    where: { id: "sol" },
    update: {
      image: "https://cryptologos.cc/logos/solana-sol-logo.png",
    },
    create: {
      id: "sol",
      name: "Solana",
      image: "https://cryptologos.cc/logos/solana-sol-logo.png",
    },
  });

  await prisma.availableActions.upsert({
    where: { id: "email" },
    update: {
      image: "https://cdn-icons-png.flaticon.com/512/281/281769.png",
    },
    create: {
      id: "email",
      name: "Email",
      image: "https://cdn-icons-png.flaticon.com/512/281/281769.png",
    },
  });
  
    await prisma.availableActions.upsert({
    where: { id: "send-sol" },
    update: {
      image: "https://cryptologos.cc/logos/solana-sol-logo.png",
    },
    create: {
      id: "send-sol",
      name: "Send Solana",
      image: "https://cryptologos.cc/logos/solana-sol-logo.png",
    },
  });


  console.log("Database seeded!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
