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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const VSRController = __importStar(require("../controllers/vsr"));
const auth_1 = require("../middleware/auth");
const VSRValidator = __importStar(require("../validators/vsr"));
const router = express_1.default.Router();
router.get("/bulk_export", auth_1.requireSignedIn, auth_1.requireStaffOrAdmin, VSRController.bulkExportVSRS);
router.get("/", auth_1.requireSignedIn, auth_1.requireStaffOrAdmin, VSRController.getAllVSRS);
router.post("/", VSRValidator.createVSR, VSRController.createVSR);
router.get("/:id", auth_1.requireSignedIn, auth_1.requireStaffOrAdmin, VSRController.getVSR);
router.delete("/:id", auth_1.requireSignedIn, auth_1.requireAdmin, VSRController.deleteVSR);
router.patch("/:id/status", auth_1.requireSignedIn, auth_1.requireStaffOrAdmin, VSRValidator.updateStatus, VSRController.updateStatus);
router.put("/:id", auth_1.requireSignedIn, auth_1.requireStaffOrAdmin, VSRValidator.updateVSR, VSRController.updateVSR);
exports.default = router;
