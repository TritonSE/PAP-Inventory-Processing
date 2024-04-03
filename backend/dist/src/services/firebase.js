"use strict";
/**
 * This file contains the configuration for firebase
 * It exports a firebase auth object which will allow users
 * to access any firebase services. For this project we will use
 * firebase to for authentication.
 */
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
exports.firebaseAuth = void 0;
const firebase = __importStar(require("firebase-admin/app"));
const auth_1 = require("firebase-admin/auth");
const internal_1 = require("../errors/internal");
const validateEnv_1 = __importDefault(require("../util/validateEnv"));
/**
 * Initializes Firebase Auth using the SERVICE_ACCOUNT_KEY environment variable
 */
let serviceAccountKey;
if (!validateEnv_1.default.SERVICE_ACCOUNT_KEY) {
    throw internal_1.InternalError.NO_SERVICE_ACCOUNT_KEY;
}
else {
    serviceAccountKey = validateEnv_1.default.SERVICE_ACCOUNT_KEY;
}
firebase.initializeApp({
    credential: firebase.cert(serviceAccountKey),
});
const firebaseAuth = (0, auth_1.getAuth)();
exports.firebaseAuth = firebaseAuth;
