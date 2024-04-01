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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const testUtils_1 = require("../src/tests/testUtils");
const furnitureItem_1 = __importDefault(require("../src/models/furnitureItem"));
describe("Furniture Item Tests", () => {
    (0, testUtils_1.mongoMemoryHooks)();
    it("GET api/furnitureItems returns all available furniture items", () => __awaiter(void 0, void 0, void 0, function* () {
        // Create a few testing furniture items and ensure they can be retrieved
        yield furnitureItem_1.default.create({
            category: "Bedroom",
            name: "Table",
            allowMultiple: false,
            categoryIndex: 1,
        }, {
            category: "Bedroom",
            name: "Rug",
            allowMultiple: true,
            categoryIndex: 2,
        });
        const res = yield (0, supertest_1.default)(app_1.default).get("/api/furnitureItems");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBe(2);
        for (let i = 0; i < 2; i++) {
            expect(res.body[i].category).toBe("Bedroom");
        }
    }));
});
