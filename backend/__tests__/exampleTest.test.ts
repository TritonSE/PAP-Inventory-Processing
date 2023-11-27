import request from "supertest";
import app from "src/app";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { MongoClient } from "mongodb";

const TEST_DB_NAME = "test";

let client: MongoClient, memoryServer: MongoMemoryServer;

/**
 * This hook runs once, before all our tests are run. In this function, we
 * set up a Mongo memory server, which emulates MongoDB by storing data in memory, to
 * make it faster to run tests using the database. This allows our backend code to interface
 * with MongoDB like normal, but all its actions will go to our test database.
 */
beforeAll(async () => {
  // Create Mongo memory server
  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: TEST_DB_NAME,
    },
  });

  // Get URI of memory server
  const testMongoUri = memoryServer.getUri();

  /**
   * Connect to memory server, so that we can drop data between tests
   * in the "afterEach" hook
   */
  client = await MongoClient.connect(testMongoUri);

  /**
   * Connect Mongoose to memory server, so we can use Mongoose like normal
   * in our backend code that we are testing
   */
  await mongoose.connect(testMongoUri);
});

/**
 * This hook runs after each test in our suite. We use this function to drop all data
 * from our testing MongoDB database, so that the database will be fresh and empty for each test.
 *
 * We may also want a "beforeEach" hook in the future, to insert some example data into
 * the testing MongoDB database before each of our tests, so that we have some data to run tests on.
 */
afterEach(async () => {
  // Drop all data from test database
  await client.db(TEST_DB_NAME).dropDatabase();
});

/**
 * This hook runs once, after all tests in the suite are done. We use this function
 * to close connections to the MongoDB memory database and clean up any other resources.
 */
afterAll(async () => {
  await client.close(true);
  await memoryServer.stop();
  await mongoose.disconnect();
});

describe("Backend Example Tests", () => {
  it("Throws 404 on GET /", async () => {
    /**
     * Since we don't have any routes yet, our Express server should return
     * a "404 Not Found" response on any URL we request
     */
    const res = await request(app).get("/");
    expect(res.header["content-type"]).toBe("text/html; charset=utf-8");
    expect(res.statusCode).toBe(404);
  });
});
