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
        allowMultiple: false,
        categoryIndex: 2,
      },
      {
        category: "Bathroom",
        name: "Wash Cloth(s)",
        allowMultiple: true,
        categoryIndex: 2,
      },
      {
        category: "Bathroom",
        name: "Towel(s)",
        allowMultiple: true,
        categoryIndex: 1,
      },
    );

    const res = await request(app).get("/api/furnitureItems");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(4);

    // Should be ordered by allowMultiple (desc), then categoryIndex (asc)
    expect(res.body[0].name).toBe("Towel(s)");
    expect(res.body[1].name).toBe("Wash Cloth(s)");
    expect(res.body[2].name).toBe("Table");
    expect(res.body[3].name).toBe("Rug");
  });
});
