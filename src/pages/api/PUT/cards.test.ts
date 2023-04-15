import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import handler from "./cards";
import { NextApiRequest, NextApiResponse } from "next";
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });
// Mock the Next.js response object
const mockResponse = () => {
  const res: Partial<NextApiResponse> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res as NextApiResponse;
};

describe("update_cards_after_pass", () => {
  let client: MongoClient;

  beforeAll(async () => {
    client = await MongoClient.connect(process.env.MONGO_URI as string);
  });

  afterAll(async () => {
    await client.close();
  });

  const POSSIBLE_PERIODS: number[] = [2, 10, 30, 150, 640, 1280, 1440];

  POSSIBLE_PERIODS.forEach((period, index) => {
    describe(`Period: ${period}`, () => {
      it("updates the card document in the collection", async () => {
        // Create a test database and collection
        const dbName = "test_db";
        const collectionName = "cards";
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Insert a mock document
        const initialDoc = {
          ease: 1,
          last_reviewed: new Date(Date.now() - period * 60 * 1000),
          period: period,
        };
        const { insertedId } = await collection.insertOne(initialDoc);

        // Create a mock Next.js request object
        const req: Partial<NextApiRequest> = {
          query: {
            _id: insertedId.toHexString(),
            test_db: dbName,
            test_collection: collectionName,
          },
        };

        const res = mockResponse();

        // Call the handler
        await handler(req as NextApiRequest, res);

        // Check if the document was updated
        const updatedDoc = await collection.findOne({ _id: insertedId });
        console.log(`
        Old period: ${initialDoc.period}\n
        Period: ${updatedDoc?.period}\n
        Old last reviewed: ${initialDoc.last_reviewed}\n
        Last reviewed: ${updatedDoc?.last_reviewed}`);
        if (period >= 1440) {
          expect(updatedDoc?.period).toBeGreaterThan(1440);
        }
        else {
          expect(updatedDoc?.period).toEqual(POSSIBLE_PERIODS[index + 1] || POSSIBLE_PERIODS[index]);

        }
        expect(updatedDoc?.last_reviewed).not.toEqual(initialDoc.last_reviewed);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ status: "Card Updated" });
      });
    });
  });
});
