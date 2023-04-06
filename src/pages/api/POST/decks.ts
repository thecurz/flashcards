import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/helpers/connectToDatabase";
import "@/helpers/config";
import type { DeckBody } from "@/types";
interface NextReqPostDeck extends NextApiRequest {
  body: DeckBody;
}
export default async function handler(
  req: NextReqPostDeck,
  res: NextApiResponse
) {
  const collection = await connectToDatabase(
    process.env.CONNECTION_STRING as string,
    process.env.DB_NAME as string,
    process.env.DECK_COLLECTION as string
  );

  const insert: DeckBody = {
    deck_owner: req.query.deck_owner as string,
    deck_name: req.query.deck_name as string,
  };
  await collection.insertOne(insert);
  const data = await collection.find({}).toArray();

  res.status(200).json(data);
}
