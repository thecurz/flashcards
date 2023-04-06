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
    process.env.USER_COLLECTION as string
  );
  const data = await collection.find({}).toArray();
  res.status(200).json(data);
}
