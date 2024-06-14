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
exports.retrieveVSRs = void 0;
const vsr_1 = __importDefault(require("../models/vsr"));
const retrieveVSRs = (search, status, incomeLevel, zipCodes, vsrIds) => __awaiter(void 0, void 0, void 0, function* () {
    let vsrs = yield vsr_1.default.aggregate([
        ...(search
            ? [
                {
                    $match: { name: { $regex: new RegExp(search, "i") } },
                },
            ]
            : []),
        {
            $addFields: {
                statusOrder: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$status", "Received"] }, then: 1 },
                            { case: { $eq: ["$status", "Approved"] }, then: 2 },
                            { case: { $eq: ["$status", "Appointment Scheduled"] }, then: 3 },
                            { case: { $eq: ["$status", "Complete"] }, then: 4 },
                            { case: { $eq: ["$status", "No-show / Incomplete"] }, then: 5 },
                            { case: { $eq: ["$status", "Archived"] }, then: 6 },
                        ],
                        default: 99,
                    },
                },
            },
        },
        { $sort: { statusOrder: 1, dateReceived: -1 } },
    ]);
    if (vsrIds && vsrIds.length > 0) {
        const vsrIdsSet = new Set(vsrIds);
        vsrs = vsrs.filter((vsr) => vsrIdsSet.has(vsr._id.toString()));
    }
    if (status) {
        vsrs = vsrs.filter((vsr) => vsr.status === status);
    }
    if (incomeLevel) {
        const incomeMap = {
            "50000": "$50,001 and over",
            "25000": "$25,001 - $50,000",
            "12500": "$12,501 - $25,000",
            "0": "$12,500 and under",
        };
        vsrs = vsrs.filter((vsr) => {
            return vsr.incomeLevel === incomeMap[incomeLevel];
        });
    }
    if (zipCodes && zipCodes.length > 0) {
        vsrs = vsrs.filter((vsr) => zipCodes.includes(vsr.zipCode.toString()));
    }
    return vsrs;
});
exports.retrieveVSRs = retrieveVSRs;
