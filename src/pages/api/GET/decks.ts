import type { NextApiRequest, NextApiResponse } from "next";
import connectToDatabase from "@/helpers/connectToDatabase";
import "@/helpers/config";

import type { DeckBody } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const collection = await connectToDatabase(
    process.env.CONNECTION_STRING as string,
    process.env.DB_NAME as string,
    process.env.DECK_COLLECTION as string
  );
  console.log(req.query);
  console.log({
    conn: process.env.CONNECTION_STRING,
    db: process.env.DB_NAME,
    col: process.env.DECK_COLLECTION,
  });
  const data = await collection
    .find({ deck_owner: req.query.deck_owner })
    .toArray();
  //TODO: SEND ONLY NEEDED DATA (VULNERABILITY)
  res.status(200).json(data);
}
