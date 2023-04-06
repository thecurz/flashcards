import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/helpers/connectToDatabase";
import "@/helpers/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const collection = await connectToDatabase(
    process.env.CONNECTION_STRING as string,
    process.env.DB_NAME as string,
    process.env.CARD_COLLECTION as string
  );
  const insert = {
    deckName: req.query.deckName,
    front: req.query.front,
    back: req.query.back,
  };
  console.log(insert);

  await collection.insertOne(insert);
  res.status(200);
}
