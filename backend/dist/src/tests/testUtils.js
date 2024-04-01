"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTestUserToken = exports.getTestUserInfo = exports.mongoMemoryHooks = void 0;
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const mongodb_1 = require("mongodb");
const mongodb_memory_server_1 = require("mongodb-memory-server");
const mongoose_1 = __importDefault(require("mongoose"));
const firebase_1 = require("../services/firebase");
const validateEnv_1 = __importDefault(require("../util/validateEnv"));
const TEST_DB_NAME = "test";
/**
 * A utility function to run some before & after testing hooks to set up and clean up
 * a Mongo memory server, used for testing.
 */
const mongoMemoryHooks = () => {
    let client, memoryServer;
    /**
     * This hook runs once, before all our tests are run. In this function, we
     * set up a Mongo memory server, which emulates MongoDB by storing data in memory, to
     * make it faster to run tests using the database. This allows our backend code to interface
     * with MongoDB like normal, but all its actions will go to our test database.
     */
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Create Mongo memory server
        memoryServer = yield mongodb_memory_server_1.MongoMemoryServer.create({
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
        client = yield mongodb_1.MongoClient.connect(testMongoUri);
        /**
         * Connect Mongoose to memory server, so we can use Mongoose like normal
         * in our backend code that we are testing
         */
        yield mongoose_1.default.connect(testMongoUri);
    }));
    /**
     * This hook runs after each test in our suite. We use this function to drop all data
     * from our testing MongoDB database, so that the database will be fresh and empty for each test.
     *
     * We may also want a "beforeEach" hook in the future, to insert some example data into
     * the testing MongoDB database before each of our tests, so that we have some data to run tests on.
     */
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Drop all data from test database
        yield client.db(TEST_DB_NAME).dropDatabase();
    }));
    /**
     * This hook runs once, after all tests in the suite are done. We use this function
     * to close connections to the MongoDB memory database and clean up any other resources.
     */
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield client.close(true);
        yield memoryServer.stop();
        yield mongoose_1.default.disconnect();
    }));
};
exports.mongoMemoryHooks = mongoMemoryHooks;
let _testUserInfo = null;
let _testUserToken = null;
/**
 * Gets the userInfo (Firebase object) for the testing user
 */
const getTestUserInfo = () => __awaiter(void 0, void 0, void 0, function* () {
    if (_testUserInfo === null) {
        _testUserInfo = yield firebase_1.firebaseAuth.getUserByEmail(validateEnv_1.default.EMAIL_USER);
    }
    return _testUserInfo;
});
exports.getTestUserInfo = getTestUserInfo;
/**
 * Gets a user token for the testing user, which can be used as an Authorization ehader
 * on HTTP requests to our backend
 */
const getTestUserToken = () => __awaiter(void 0, void 0, void 0, function* () {
    if (_testUserToken === null) {
        const testUserInfo = yield (0, exports.getTestUserInfo)();
        const customToken = yield firebase_1.firebaseAuth.createCustomToken(testUserInfo.uid);
        const firebaseApp = (0, app_1.initializeApp)(validateEnv_1.default.BACKEND_FIREBASE_SETTINGS);
        const auth = (0, auth_1.getAuth)(firebaseApp);
        const { user } = yield (0, auth_1.signInWithCustomToken)(auth, customToken);
        _testUserToken = yield user.getIdToken();
    }
    return _testUserToken;
});
exports.getTestUserToken = getTestUserToken;
