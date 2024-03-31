import request from "supertest";

import app from "src/app";
import { mongoMemoryHooks } from "src/tests/testUtils";
import FurnitureItemModel from "src/models/furnitureItem";

describe("Furniture Item Tests", () => {
  mongoMemoryHooks();

  it("GET api/furnitureItems returns all available furniture items", async () => {
    // Create a few testing furniture items and ensure they can be retrieved
    await FurnitureItemModel.create(
      {
        category: "Bedroom",
        name: "Table",
        allowMultiple: false,
        categoryIndex: 1,
      },
      {
        category: "Bedroom",
        name: "Rug",
        allowMultiple: true,
        categoryIndex: 2,
      },
    );

    const res = await request(app).get("/api/furnitureItems");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(2);
    for (let i = 0; i < 2; i++) {
      expect(res.body[i].category).toBe("Bedroom");
    }
  });
});
