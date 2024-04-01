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
const vsr_1 = __importDefault(require("../src/models/vsr"));
describe("VSR Tests", () => {
    (0, testUtils_1.mongoMemoryHooks)();
    const vsrTestData = {
        name: "Test Veteran 1",
        gender: "Female",
        age: "54",
        maritalStatus: "Single",
        agesOfBoys: [10],
        agesOfGirls: [11, 12],
        ethnicity: ["Caucasian"],
        employmentStatus: "Employed",
        incomeLevel: "$12,500 - $25,000",
        sizeOfHome: "House",
        streetAddress: "1111 TSE Lane",
        city: "La Jolla",
        state: "CA",
        zipCode: "11245",
        phoneNumber: "1112224444",
        email: "tsepapdev@gmail.com",
        branch: ["Air Force", "Navy"],
        conflicts: ["WWII", "Irani Crisis"],
        dischargeStatus: "dischargeStatus-1",
        serviceConnected: false,
        lastRank: "E-5",
        militaryID: 9999,
        petCompanion: true,
        hearFrom: "Family-1",
        selectedFurnitureItems: [],
    };
    const createTestVSR = () => __awaiter(void 0, void 0, void 0, function* () {
        const currentDate = new Date();
        return yield vsr_1.default.create(Object.assign(Object.assign({}, vsrTestData), { dateReceived: currentDate, lastUpdated: currentDate, status: "Received" }));
    });
    const signInAsRole = (role) => __awaiter(void 0, void 0, void 0, function* () {
        const testUserInfo = yield (0, testUtils_1.getTestUserInfo)();
        const testUser = yield user_1.default.create({
            role,
            uid: testUserInfo.uid,
        });
        return { testUser, testToken: yield (0, testUtils_1.getTestUserToken)() };
    });
    it("POST /api/vsr creates a new VSR", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default)
            .post("/api/vsr")
            .send(vsrTestData)
            .set("Content-Type", "application/json");
        expect(res.statusCode).toBe(201);
        // Ensure that VSR was actually created in the DB
        const allVsrs = yield vsr_1.default.find();
        expect(allVsrs.length).toBe(1);
    }));
    it("GET /api/vsr requires user to be signed in", () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/vsr");
        expect(res.statusCode).toBe(401);
    }));
    it("GET /api/vsr returns all submitted VSRs to staff", () => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(Array(3).fill(null).map(createTestVSR));
        const { testToken } = yield signInAsRole(user_1.UserRole.STAFF);
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/vsr").set("Authorization", `Bearer ${testToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.vsrs.length).toBe(3);
        expect(res.body.vsrs[0].name).toBe("Test Veteran 1");
    }));
    it("GET /api/vsr returns all submitted VSRs to admin", () => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(Array(3).fill(null).map(createTestVSR));
        const { testToken } = yield signInAsRole(user_1.UserRole.STAFF);
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/vsr").set("Authorization", `Bearer ${testToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.vsrs.length).toBe(3);
        expect(res.body.vsrs[0].name).toBe("Test Veteran 1");
    }));
    it("GET /api/vsr/:id requires user to be signed in", () => __awaiter(void 0, void 0, void 0, function* () {
        const testVsr = yield createTestVSR();
        const vsrId = testVsr._id;
        const res = yield (0, supertest_1.default)(app_1.default).get(`/api/vsr/${vsrId}`);
        expect(res.statusCode).toBe(401);
    }));
    it("GET /api/vsr/:id returns 404 for invalid VSR id", () => __awaiter(void 0, void 0, void 0, function* () {
        const { testToken } = yield signInAsRole(user_1.UserRole.STAFF);
        // We can use any Object ID here because no VSRs have been created yet
        const res = yield (0, supertest_1.default)(app_1.default)
            .get("/api/vsr/65bc31561826f0d6ee2c4b21")
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.statusCode).toBe(404);
    }));
    it("GET /api/vsr/:id returns a single VSR to staff", () => __awaiter(void 0, void 0, void 0, function* () {
        const testVsr = yield createTestVSR();
        const vsrId = testVsr._id;
        const { testToken } = yield signInAsRole(user_1.UserRole.STAFF);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/vsr/${vsrId}`)
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Test Veteran 1");
        expect(res.body.status).toBe("Received");
        expect(res.body._id).toBe(vsrId.toString());
    }));
    it("GET /api/vsr/:id returns a single VSR to admin", () => __awaiter(void 0, void 0, void 0, function* () {
        const testVsr = yield createTestVSR();
        const vsrId = testVsr._id;
        const { testToken } = yield signInAsRole(user_1.UserRole.ADMIN);
        const res = yield (0, supertest_1.default)(app_1.default)
            .get(`/api/vsr/${vsrId}`)
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe("Test Veteran 1");
        expect(res.body.status).toBe("Received");
        expect(res.body._id).toBe(vsrId.toString());
    }));
    it("DELETE /api/vsr/:id requires user to be signed in", () => __awaiter(void 0, void 0, void 0, function* () {
        const testVsr = yield createTestVSR();
        const vsrId = testVsr._id;
        const res = yield (0, supertest_1.default)(app_1.default).delete(`/api/vsr/${vsrId}`);
        expect(res.statusCode).toBe(401);
        // Ensure that VSR was not deleted from the DB
        const allVsrs = yield vsr_1.default.find();
        expect(allVsrs.length).toBe(1);
    }));
    it("DELETE /api/vsr/:id returns permission denied to non-admin user", () => __awaiter(void 0, void 0, void 0, function* () {
        const testVsr = yield createTestVSR();
        const vsrId = testVsr._id;
        const { testToken } = yield signInAsRole(user_1.UserRole.STAFF);
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/vsr/${vsrId}`)
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.statusCode).toBe(403);
        // Ensure that VSR was not deleted from the DB
        const allVsrs = yield vsr_1.default.find();
        expect(allVsrs.length).toBe(1);
    }));
    it("DELETE /api/vsr/:id returns 404 for invalid VSR id", () => __awaiter(void 0, void 0, void 0, function* () {
        const { testToken } = yield signInAsRole(user_1.UserRole.ADMIN);
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete("/api/vsr/65bc31561826f0d6ee2c4b21")
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.statusCode).toBe(404);
    }));
    it("DELETE /api/vsr/:id successfully deletes valid VSR", () => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(Array(3).fill(null).map(createTestVSR));
        const allVsrs = yield vsr_1.default.find();
        const vsrId = allVsrs[0]._id;
        const { testToken } = yield signInAsRole(user_1.UserRole.ADMIN);
        const res = yield (0, supertest_1.default)(app_1.default)
            .delete(`/api/vsr/${vsrId}`)
            .set("Authorization", `Bearer ${testToken}`);
        expect(res.statusCode).toBe(204);
        // Ensure that VSR was deleted from the DB
        const newAllVsrs = yield vsr_1.default.find();
        expect(newAllVsrs.length).toBe(2);
        const deletedVsr = yield vsr_1.default.findById(vsrId);
        expect(deletedVsr).toBeNull();
    }));
    it("PATCH /api/vsr/:id/status requires user to be signed in", () => __awaiter(void 0, void 0, void 0, function* () {
        const testVsr = yield createTestVSR();
        const vsrId = testVsr._id;
        const res = yield (0, supertest_1.default)(app_1.default)
            .patch(`/api/vsr/${vsrId}/status`)
            .send({ status: "Approved" })
            .set("Content-Type", "application/json");
        expect(res.statusCode).toBe(401);
        // Ensure that VSR status in DB was not changed
        const vsr = yield vsr_1.default.findById(vsrId);
        expect(vsr).not.toBeNull();
        expect(vsr.status).toBe("Received");
    }));
    it("PATCH /api/vsr/:id/status returns 404 for invalid VSR id", () => __awaiter(void 0, void 0, void 0, function* () {
        const { testToken } = yield signInAsRole(user_1.UserRole.ADMIN);
        const res = yield (0, supertest_1.default)(app_1.default)
            .patch("/api/vsr/65bc31561826f0d6ee2c4b21/status")
            .send({ status: "Approved" })
            .set("Authorization", `Bearer ${testToken}`)
            .set("Content-Type", "application/json");
        expect(res.statusCode).toBe(404);
    }));
    it("PATCH /api/vsr/:id/status throws 400 when status is missing", () => __awaiter(void 0, void 0, void 0, function* () {
        const testVsr = yield createTestVSR();
        const vsrId = testVsr._id;
        const { testToken } = yield signInAsRole(user_1.UserRole.ADMIN);
        const res = yield (0, supertest_1.default)(app_1.default)
            .patch(`/api/vsr/${vsrId}/status`)
            .send({})
            .set("Authorization", `Bearer ${testToken}`)
            .set("Content-Type", "application/json");
        expect(res.statusCode).toBe(400);
        // Ensure that VSR status in DB was not changed
        const vsr = yield vsr_1.default.findById(vsrId);
        expect(vsr).not.toBeNull();
        expect(vsr.status).toBe("Received");
    }));
    it("PATCH /api/vsr/:id/status successfully updates VSR status", () => __awaiter(void 0, void 0, void 0, function* () {
        yield Promise.all(Array(3).fill(null).map(createTestVSR));
        const allVsrs = yield vsr_1.default.find();
        const vsrId = allVsrs[0]._id;
        const { testToken } = yield signInAsRole(user_1.UserRole.ADMIN);
        const res = yield (0, supertest_1.default)(app_1.default)
            .patch(`/api/vsr/${vsrId}/status`)
            .send({ status: "Approved" })
            .set("Authorization", `Bearer ${testToken}`)
            .set("Content-Type", "application/json");
        expect(res.statusCode).toBe(200);
        // Ensure that the correct VSR's status was updated
        const newAllVsrs = yield vsr_1.default.find();
        expect(newAllVsrs.length).toBe(3);
        for (const vsr of newAllVsrs) {
            if (vsr._id.toString() === vsrId.toString()) {
                expect(vsr.status).toBe("Approved");
            }
            else {
                expect(vsr.status).toBe("Received");
            }
        }
    }));
});
