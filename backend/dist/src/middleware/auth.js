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
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireStaffOrAdmin = exports.requireSignedIn = void 0;
const auth_1 = require("../services/auth");
const auth_2 = require("../errors/auth");
const user_1 = __importStar(require("../models/user"));
/**
 * A middleware that requires the user to be signed in and have a valid Firebase token
 * in the "Authorization" header
 */
const requireSignedIn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers.authorization;
    // Token shoud be "Bearer: <token>"
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split("Bearer ")[1];
    if (!token) {
        return res
            .status(auth_2.AuthError.TOKEN_NOT_IN_HEADER.status)
            .send(auth_2.AuthError.TOKEN_NOT_IN_HEADER.displayMessage(true));
    }
    let userInfo;
    try {
        userInfo = yield (0, auth_1.decodeAuthToken)(token);
    }
    catch (e) {
        return res
            .status(auth_2.AuthError.INVALID_AUTH_TOKEN.status)
            .send(auth_2.AuthError.INVALID_AUTH_TOKEN.displayMessage(true));
    }
    if (userInfo) {
        req.userUid = userInfo.uid;
        const user = yield user_1.default.findOne({ uid: userInfo.uid });
        if (!user) {
            return res
                .status(auth_2.AuthError.USER_NOT_FOUND.status)
                .send(auth_2.AuthError.USER_NOT_FOUND.displayMessage(true));
        }
        return next();
    }
    return res.status(auth_2.AuthError.INVALID_AUTH_TOKEN.status).send(auth_2.AuthError.INVALID_AUTH_TOKEN.message);
});
exports.requireSignedIn = requireSignedIn;
/**
 * A middleware that requires the user to have either the staff or admin role
 */
const requireStaffOrAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userUid } = req;
    const user = yield user_1.default.findOne({ uid: userUid });
    if (!user || ![user_1.UserRole.STAFF, user_1.UserRole.ADMIN].includes(user.role)) {
        return res
            .status(auth_2.AuthError.NOT_STAFF_OR_ADMIN.status)
            .send(auth_2.AuthError.NOT_STAFF_OR_ADMIN.displayMessage(true));
    }
    return next();
});
exports.requireStaffOrAdmin = requireStaffOrAdmin;
/**
 * A middleware that requires the user to have the admin role
 */
const requireAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { userUid } = req;
    const user = yield user_1.default.findOne({ uid: userUid });
    if (!user || user.role !== user_1.UserRole.ADMIN) {
        return res.status(auth_2.AuthError.NOT_ADMIN.status).send(auth_2.AuthError.NOT_ADMIN.displayMessage(true));
    }
    return next();
});
exports.requireAdmin = requireAdmin;
