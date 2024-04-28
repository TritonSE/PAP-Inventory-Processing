import request from "supertest";

import app from "src/app";
import { getTestUserInfo, getTestUserToken, mongoMemoryHooks } from "src/tests/testUtils";
import UserModel, { UserRole } from "src/models/user";
import VSRModel from "src/models/vsr";

describe("VSR Tests", () => {
  mongoMemoryHooks();

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

  const createTestVSR = async () => {
    const currentDate = new Date();

    return await VSRModel.create({
      ...vsrTestData,
      dateReceived: currentDate,
      lastUpdated: currentDate,

      status: "Received",
    });
  };

  const signInAsRole = async (role: UserRole) => {
    const testUserInfo = await getTestUserInfo();
    const testUser = await UserModel.create({
      role,
      uid: testUserInfo.uid,
    });

    return { testUser, testToken: await getTestUserToken() };
  };

  it("POST /api/vsr creates a new VSR", async () => {
    const res = await request(app)
      .post("/api/vsr")
      .send(vsrTestData)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(201);

    // Ensure that VSR was actually created in the DB
    const allVsrs = await VSRModel.find();
    expect(allVsrs.length).toBe(1);
  });

  it("GET /api/vsr requires user to be signed in", async () => {
    const res = await request(app).get("/api/vsr");
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/vsr returns all submitted VSRs to staff", async () => {
    await Promise.all(Array(3).fill(null).map(createTestVSR));

    const { testToken } = await signInAsRole(UserRole.STAFF);

    const res = await request(app).get("/api/vsr").set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.vsrs.length).toBe(3);
    expect(res.body.vsrs[0].name).toBe("Test Veteran 1");
  });

  it("GET /api/vsr returns all submitted VSRs to admin", async () => {
    await Promise.all(Array(3).fill(null).map(createTestVSR));

    const { testToken } = await signInAsRole(UserRole.ADMIN);

    const res = await request(app).get("/api/vsr").set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.vsrs.length).toBe(3);
    expect(res.body.vsrs[0].name).toBe("Test Veteran 1");
  });

  it("GET /api/vsr/:id requires user to be signed in", async () => {
    const testVsr = await createTestVSR();
    const vsrId = testVsr._id;

    const res = await request(app).get(`/api/vsr/${vsrId}`);
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/vsr/:id returns 404 for invalid VSR id", async () => {
    const { testToken } = await signInAsRole(UserRole.STAFF);

    // We can use any Object ID here because no VSRs have been created yet
    const res = await request(app)
      .get("/api/vsr/65bc31561826f0d6ee2c4b21")
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(404);
  });

  it("GET /api/vsr/:id returns a single VSR to staff", async () => {
    const testVsr = await createTestVSR();
    const vsrId = testVsr._id;

    const { testToken } = await signInAsRole(UserRole.STAFF);

    const res = await request(app)
      .get(`/api/vsr/${vsrId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Veteran 1");
    expect(res.body.status).toBe("Received");
    expect(res.body._id).toBe(vsrId.toString());
  });

  it("GET /api/vsr/:id returns a single VSR to admin", async () => {
    const testVsr = await createTestVSR();
    const vsrId = testVsr._id;

    const { testToken } = await signInAsRole(UserRole.ADMIN);

    const res = await request(app)
      .get(`/api/vsr/${vsrId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Test Veteran 1");
    expect(res.body.status).toBe("Received");
    expect(res.body._id).toBe(vsrId.toString());
  });

  it("DELETE /api/vsr/:id requires user to be signed in", async () => {
    const testVsr = await createTestVSR();
    const vsrId = testVsr._id;

    const res = await request(app).delete(`/api/vsr/${vsrId}`);
    expect(res.statusCode).toBe(401);

    // Ensure that VSR was not deleted from the DB
    const allVsrs = await VSRModel.find();
    expect(allVsrs.length).toBe(1);
  });

  it("DELETE /api/vsr/:id returns permission denied to non-admin user", async () => {
    const testVsr = await createTestVSR();
    const vsrId = testVsr._id;

    const { testToken } = await signInAsRole(UserRole.STAFF);

    const res = await request(app)
      .delete(`/api/vsr/${vsrId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(403);

    // Ensure that VSR was not deleted from the DB
    const allVsrs = await VSRModel.find();
    expect(allVsrs.length).toBe(1);
  });

  it("DELETE /api/vsr/:id returns 404 for invalid VSR id", async () => {
    const { testToken } = await signInAsRole(UserRole.ADMIN);

    const res = await request(app)
      .delete("/api/vsr/65bc31561826f0d6ee2c4b21")
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(404);
  });

  it("DELETE /api/vsr/:id successfully deletes valid VSR", async () => {
    await Promise.all(Array(3).fill(null).map(createTestVSR));
    const allVsrs = await VSRModel.find();
    const vsrId = allVsrs[0]._id;

    const { testToken } = await signInAsRole(UserRole.ADMIN);

    const res = await request(app)
      .delete(`/api/vsr/${vsrId}`)
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(204);

    // Ensure that VSR was deleted from the DB
    const newAllVsrs = await VSRModel.find();
    expect(newAllVsrs.length).toBe(2);

    const deletedVsr = await VSRModel.findById(vsrId);
    expect(deletedVsr).toBeNull();
  });

  it("PATCH /api/vsr/:id/status requires user to be signed in", async () => {
    const testVsr = await createTestVSR();
    const vsrId = testVsr._id;

    const res = await request(app)
      .patch(`/api/vsr/${vsrId}/status`)
      .send({ status: "Approved" })
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(401);

    // Ensure that VSR status in DB was not changed
    const vsr = await VSRModel.findById(vsrId);
    expect(vsr).not.toBeNull();
    expect(vsr!.status).toBe("Received");
  });

  it("PATCH /api/vsr/:id/status returns 404 for invalid VSR id", async () => {
    const { testToken } = await signInAsRole(UserRole.ADMIN);

    const res = await request(app)
      .patch("/api/vsr/65bc31561826f0d6ee2c4b21/status")
      .send({ status: "Approved" })
      .set("Authorization", `Bearer ${testToken}`)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(404);
  });

  it("PATCH /api/vsr/:id/status throws 400 when status is missing", async () => {
    const testVsr = await createTestVSR();
    const vsrId = testVsr._id;

    const { testToken } = await signInAsRole(UserRole.ADMIN);

    const res = await request(app)
      .patch(`/api/vsr/${vsrId}/status`)
      .send({})
      .set("Authorization", `Bearer ${testToken}`)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(400);

    // Ensure that VSR status in DB was not changed
    const vsr = await VSRModel.findById(vsrId);
    expect(vsr).not.toBeNull();
    expect(vsr!.status).toBe("Received");
  });

  it("PATCH /api/vsr/:id/status successfully updates VSR status", async () => {
    await Promise.all(Array(3).fill(null).map(createTestVSR));
    const allVsrs = await VSRModel.find();
    const vsrId = allVsrs[0]._id;

    const { testToken } = await signInAsRole(UserRole.ADMIN);

    const res = await request(app)
      .patch(`/api/vsr/${vsrId}/status`)
      .send({ status: "Approved" })
      .set("Authorization", `Bearer ${testToken}`)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(200);

    // Ensure that the correct VSR's status was updated
    const newAllVsrs = await VSRModel.find();
    expect(newAllVsrs.length).toBe(3);

    for (const vsr of newAllVsrs) {
      if (vsr._id.toString() === vsrId.toString()) {
        expect(vsr.status).toBe("Approved");
      } else {
        expect(vsr.status).toBe("Received");
      }
    }
  });

  it("PUT /api/vsr/:id requires user to be signed in", async () => {
    const testVsr = await createTestVSR();
    const vsrId = testVsr._id;

    const res = await request(app)
      .put(`/api/vsr/${vsrId}`)
      .send({
        ...vsrTestData,
        name: "Updated name",
        email: "updatedemail@gmail.com",
      })
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(401);

    // Ensure that VSR in DB was not updated
    const currentVsr = await VSRModel.findById(vsrId);
    expect(currentVsr).not.toBeNull();
    expect(currentVsr!.name).toBe("Test Veteran 1");
    expect(currentVsr!.email).toBe("tsepapdev@gmail.com");
  });

  it("PUT /api/vsr/:id returns 404 for invalid VSR id", async () => {
    const { testToken } = await signInAsRole(UserRole.STAFF);

    const res = await request(app)
      .put("/api/vsr/65bc31561826f0d6ee2c4b21")
      .send({
        ...vsrTestData,
        name: "Updated name",
        email: "updatedemail@gmail.com",
      })
      .set("Authorization", `Bearer ${testToken}`)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(404);
  });

  it("PUT /api/vsr/:id throws 400 when required fields are missing", async () => {
    const testVsr = await createTestVSR();
    const vsrId = testVsr._id;

    const { testToken } = await signInAsRole(UserRole.STAFF);

    const res = await request(app)
      .put(`/api/vsr/${vsrId}`)
      .send({
        name: "Updated name",
        email: "updatedemail@gmail.com",
      })
      .set("Authorization", `Bearer ${testToken}`)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(400);

    // Ensure that VSR in DB was not updated
    const currentVsr = await VSRModel.findById(vsrId);
    expect(currentVsr).not.toBeNull();
    expect(currentVsr!.name).toBe("Test Veteran 1");
    expect(currentVsr!.email).toBe("tsepapdev@gmail.com");
  });

  it("PUT /api/vsr/:id successfully updates VSR data", async () => {
    const testVsr = await createTestVSR();
    const vsrId = testVsr._id;

    const { testToken } = await signInAsRole(UserRole.STAFF);

    const res = await request(app)
      .put(`/api/vsr/${vsrId}`)
      .send({
        ...vsrTestData,
        name: "Updated name",
        email: "updatedemail@gmail.com",
      })
      .set("Authorization", `Bearer ${testToken}`)
      .set("Content-Type", "application/json");
    expect(res.statusCode).toBe(200);

    // Ensure that VSR in DB was updated
    const currentVsr = await VSRModel.findById(vsrId);
    expect(currentVsr).not.toBeNull();
    expect(currentVsr!.name).toBe("Updated name");
    expect(currentVsr!.email).toBe("updatedemail@gmail.com");
  });

  it("GET /api/vsr/bulk_export requires user to be signed in", async () => {
    const res = await request(app).get("/api/vsr/bulk_export");
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/vsr/bulk_export as staff with no VSRs in database", async () => {
    const { testToken } = await signInAsRole(UserRole.STAFF);

    const res = await request(app)
      .get("/api/vsr/bulk_export")
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(200);
  });

  it("GET /api/vsr/bulk_export as staff with VSRs in database", async () => {
    await Promise.all(Array(3).fill(null).map(createTestVSR));

    const { testToken } = await signInAsRole(UserRole.STAFF);

    const res = await request(app)
      .get("/api/vsr/bulk_export")
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(200);
  });
});
