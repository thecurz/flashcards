import { MongoClient, ServerApiVersion, Db, Collection } from "mongodb";
export default async function connectToDatabase(
  connectionString: string,
  dbName: string,
  collectionName: string
) {
  const client: MongoClient = new MongoClient(connectionString);
  await client.connect();

  const db: Db = client.db(dbName);
  const collection: Collection = db.collection(collectionName);

  return collection;
}
