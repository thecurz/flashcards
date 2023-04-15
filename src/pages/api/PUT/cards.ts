import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId } from "mongodb";
import connectToDatabase from "@/helpers/connectToDatabase";
import calculatePeriodPass from "@/helpers/calculatePeriodPass";
import firstPeriods from "@/helpers/firstPeriods";
import "@/helpers/config";
import { WithId } from "mongodb";
import { Document } from "mongodb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //erase
  let DB_NAME: string = req.query.test_db ? req.query.test_db as string : process.env.DB_NAME as string;
  let COLLECTION: string = req.query.test_collection ? req.query.test_collection as string : process.env.CARD_COLLECTION as string;

  const collection = await connectToDatabase(
    process.env.CONNECTION_STRING as string,
    DB_NAME,
    COLLECTION
  );
  if (req.query._id === undefined) {
    console.log("_id was not given as part of query for /PUT/cards...");
    res.status(401);
    //TODO: make sure return doesnt break api
    return;
  }
  const id = new ObjectId(req.query._id as string);
  const document: WithId<Document> | undefined = (await collection.find({ _id: id }).toArray()).at(0);

  const ease = document?.ease ? document.ease : 1;
  const new_last_reviewed = new Date();
  const difference_in_minutes: number =
    (new_last_reviewed.getTime() - new Date(document?.last_reviewed).getTime()) / 60_000;
  const period = document?.period ? document.period : 10;
  const new_period: number = calculatePeriodPass(period, difference_in_minutes, ease);

  const filter = { _id: new ObjectId(id) };
  const update = {
    $set: { period: new_period, last_reviewed: new_last_reviewed },
  };
  await collection.updateOne(filter, update);
  res.status(200).json({ status: "Card Updated" });
}
