import { Router } from "express";
import { authmiddleware } from "../middlerwear";
import { ZapCreateSchema } from "../types";
import { client } from "../db/index.js";
import { createId } from "@paralleldrive/cuid2"; // Use a CUID generator

const router = Router();
//@ts-ignore
router.post("/", authmiddleware, async (req, res) => {
    //@ts-ignore
    const id: string = req.id;
    const parsedData = ZapCreateSchema.safeParse(req.body);
    console.log("Parsed Data:", parsedData);
  if (!parsedData.success) {
    return res.status(400).json({ error: parsedData.error.errors });
  }

  try {
    //@ts-ignore

   const zapId1= await client.$transaction(async (tx) => {
      const zapId = createId(); // Generate Zap ID upfront
      const triggerId = parsedData.data.avilableTriggerId; // Use the provided trigger ID
       // Generate User ID upfront
      // Generate Trigerd ID upfront

      // Create Zap with the correct triggerId
      const zap = await tx.zap.create({
        data: {
          id: zapId,
          userId: id, // Use the authenticated user's ID
          triggerId: triggerId, // Set to pre-generated Trigerd ID
          actions: {
            create: parsedData.data.actions.map((x, index) => ({
              actoinId: x.availableactionId, // Corrected field name (actoinId)
              sortingOrder: index,
              metadata: x.actionMeta || {}, // Use actionMeta or an empty object if not provided
            })),
          },
        },
    
      });

      // Create Trigerd with references to Zap and AvailableTriggers
      await tx.trigerd.create({
        data: {
           // Use pre-generated ID
          triggerId: parsedData.data.avilableTriggerId, // Corrected variable name
          zapId: zapId,
        
        }
      }); 
      return zap.id;
    });

    return res.status(201).json({ message: "Zap created successfully",
    zapId: zapId1, // Return the generated Zap ID
     });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});
//@ts-ignore
router.get("/", authmiddleware, async (req, res) => {
  //@ts-ignore

  const id = req.id;
  const zaps = await client.zap.findMany({
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
});
//@ts-ignore
router.get("/:zapId",authmiddleware, async (req, res) => {
    //@ts-ignore
    const id =req.id;
    const zapId = req.params.zapId as string;
    const zap = await client.zap.findUnique({
      where: {
        id: zapId,
        userId:id
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
    return res.status(200).json(zap);
});

//@ts-ignore
router.delete("/:zapId", authmiddleware, async (req, res) => {
  //@ts-ignore
  const id = req.id;
  const zapId = req.params.zapId as string;

  const zap = await client.zap.findUnique({
    where: {
      id: zapId,
      userId: id,
    },
  });

  if (!zap) {
    return res.status(404).json({ error: "Zap not found" });
  }

  await client.zap.delete({
    where: {
      id: zapId,
    },
  });

  return res.json({ message: "Zap deleted successfully" });
});

export const zapRouter = router;