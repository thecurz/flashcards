import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectId, WithId, Document } from "mongodb";
import connectToDatabase from "@/helpers/connectToDatabase";
import calculatePeriodPass from "@/helpers/calculatePeriodPass";
import "@/helpers/config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const dbName = req.query.test_db ? req.query.test_db as string : process.env.DB_NAME as string;
  const collectionName = req.query.test_collection ? req.query.test_collection as string : process.env.CARD_COLLECTION as string;

  const collection = await connectToDatabase(
    process.env.CONNECTION_STRING as string,
    dbName,
    collectionName
  );

  if (!isQueryValid(req)) {
    res.status(401).json({ status: "_id was not given as part of query for api/PUT/cards..." });
    return;
  }
  const id = new ObjectId(req.query._id);
  const document = (await collection.find({ _id: id }).toArray()).at(0) as ValidDocument | undefined;
  if (!validateDocument(document)) {
    res.status(401).json({ status: "Card document doesn't contain all the necessary values..." })
    return
  }

  const ease = document.ease;
  const new_last_reviewed = new Date();
  const difference_in_minutes=
    (new_last_reviewed.getTime() - new Date(document.last_reviewed).getTime()) / 60_000;
  const period = document.period;
  const new_period = calculatePeriodPass(period, difference_in_minutes, ease);

  const filter = { _id: id };
  const update = {
    $set: { period: new_period, last_reviewed: new_last_reviewed },
  };
  await collection.updateOne(filter, update);
  res.status(200).json({ status: "Card Updated" });
}
function isQueryValid(req: NextApiRequest): req is NextApiRequest & { query: { _id: string } } {
  return req.query._id !== undefined && typeof req.query._id === 'string';
}

type ValidDocument = WithId<Document> & {
  ease: number;
  last_reviewed: Date;
  period: number;
};

function validateDocument(document: ValidDocument | undefined): document is ValidDocument {
  return (
    document !== undefined &&
    typeof document.ease === "number" &&
    document.last_reviewed instanceof Date &&
    typeof document.period === "number"
  );
}