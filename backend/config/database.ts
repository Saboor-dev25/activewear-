import "server-only";
import { MongoClient, type Db } from "mongodb";

const globalMongo = globalThis as typeof globalThis & {
  activewearMongoCache?: { uri: string; promise: Promise<MongoClient> };
};

let clientPromise: Promise<MongoClient> | undefined;
let clientUri: string | undefined;

function getClient(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required to use the content API.");
  const cached = process.env.NODE_ENV !== "production" ? globalMongo.activewearMongoCache : undefined;
  if (cached?.uri === uri) return cached.promise;
  if (clientPromise && clientUri === uri) return clientPromise;

  const promise = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 0,
    maxIdleTimeMS: 60_000,
  }).connect();
  const entry = { uri, promise };
  clientPromise = promise;
  clientUri = uri;
  if (process.env.NODE_ENV !== "production") globalMongo.activewearMongoCache = entry;

  // A failed handshake must not poison the dev-server cache or prevent a
  // corrected .env.local value from being used after Next reloads the module.
  void promise.catch(() => {
    if (clientPromise === promise) {
      clientPromise = undefined;
      clientUri = undefined;
    }
    if (globalMongo.activewearMongoCache === entry) delete globalMongo.activewearMongoCache;
  });
  return promise;
}

export async function getDatabase(): Promise<Db> {
  const client = await getClient();
  const configuredName = process.env.MONGODB_DB;
  if (configuredName) return client.db(configuredName);
  const defaultDb = client.db().databaseName;
  if (!defaultDb) throw new Error("Add a database name to MONGODB_URI or set MONGODB_DB.");
  return client.db(defaultDb);
}
