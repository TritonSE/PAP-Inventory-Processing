import request from "supertest";

import app from "src/app";
import { getTestUserToken, mongoMemoryHooks } from "__tests__/testUtils";
import UserModel, { UserRole } from "src/models/user";
import { firebaseAuth } from "src/services/firebase";
import env from "src/util/validateEnv";

describe("User Tests", () => {
  mongoMemoryHooks();

  it("GET /api/user/whoami returns 401 when no token is provided", async () => {
    const res = await request(app).get("/api/user/whoami");
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/user/whoami returns 401 when an invalid token is provided", async () => {
    const res = await request(app)
      .get("/api/user/whoami")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/user/whoami returns current user when a valid token is provided", async () => {
    const userInfo = await firebaseAuth.getUserByEmail(env.EMAIL_USER);
    const testUser = await UserModel.create({
      role: UserRole.STAFF,
      uid: userInfo.uid,
    });
    const testToken = await getTestUserToken();

    const res = await request(app)
      .get("/api/user/whoami")
      .set("Authorization", `Bearer ${testToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.user.uid).toBe(userInfo.uid);
    expect(res.body.user.role).toBe(UserRole.STAFF);
    expect(res.body.user._id).toBe(testUser._id.toString());
  });
});
