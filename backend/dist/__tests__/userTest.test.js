"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const testUtils_1 = require("../src/tests/testUtils");
const user_1 = __importStar(require("../src/models/user"));
const firebase_1 = require("../src/services/firebase");
const validateEnv_1 = __importDefault(require("../src/util/validateEnv"));
describe("User Tests", () => {
    (0, testUtils_1.mongoMemoryHooks)();
    it("GET /api/user/whoami returns 401 when no token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/user/whoami");
        expect(res.statusCode).toBe(401);
    }));
    it("GET /api/user/whoami returns 401 when an invalid token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/user/whoami")
            .set("Authorization", "Bearer invalidtoken");
        expect(res.statusCode).toBe(401);
    }));
    it("GET /api/user/whoami returns current user when a valid token is provided", () => __awaiter(void 0, void 0, void 0, function* () {
        const userInfo = yield firebase_1.firebaseAuth.getUserByEmail(validateEnv_1.default.EMAIL_USER);
        const testUser = yield user_1.default.create({
            role: user_1.UserRole.STAFF,
            uid: userInfo.uid,
        });
        const testToken = yield (0, testUtils_1.getTestUserToken)();
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/user/whoami")
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.uid).toBe(userInfo.uid);
        expect(res.body.role).toBe(user_1.UserRole.STAFF);
        expect(res.body._id).toBe(testUser._id.toString());
    }));
});
