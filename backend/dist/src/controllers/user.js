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
exports.deleteUser = exports.notifyResetPassword = exports.changeUserPassword = exports.createUser = exports.getUsers = exports.getWhoAmI = void 0;
const firebase_1 = require("../services/firebase");
const user_1 = __importStar(require("../models/user"));
const express_validator_1 = require("express-validator");
const validationErrorParser_1 = __importDefault(require("../util/validationErrorParser"));
const http_errors_1 = __importDefault(require("http-errors"));
const emails_1 = require("../services/emails");
/**
 * Retrieves data about the current user (their MongoDB ID, Firebase UID, and role).
 * Requires the user to be signed in.
 */
const getWhoAmI = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userUid } = req;
        const user = yield user_1.default.findOne({ uid: userUid });
        const { _id, uid, role } = user;
        res.status(200).send({
            _id,
            uid,
            role,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.getWhoAmI = getWhoAmI;
/**
 * Retrieves a list of all users in our database
 */
const getUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const papUsers = yield user_1.default.find();
        const displayUsers = [];
        for (const papUser of papUsers) {
            const { uid, _id } = papUser;
            try {
                const firebaseUser = yield firebase_1.firebaseAuth.getUser(uid);
                const { displayName, email } = firebaseUser;
                const displayUser = { _id, uid, displayName, email };
                displayUsers.push(displayUser);
            }
            catch (error) {
                next(error);
            }
        }
        res.status(200).json(displayUsers);
    }
    catch (error) {
        next(error);
    }
});
exports.getUsers = getUsers;
/**
 * Creates a new user, in both the Firebase and MongoDB databases
 */
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    try {
        (0, validationErrorParser_1.default)(errors);
        const { name, email, password } = req.body;
        // First, call the Firebase API to create a new user
        const firebaseUser = yield firebase_1.firebaseAuth.createUser({
            displayName: name,
            email,
            password,
        });
        // Now, using the UID of the new Firebase user, create a user in our MongoDB database
        const user = yield user_1.default.create({
            uid: firebaseUser.uid,
            // We can only create new staff accounts, not admin accounts.
            role: user_1.UserRole.STAFF,
        });
        res.status(201).json(user);
    }
    catch (error) {
        next(error);
    }
});
exports.createUser = createUser;
/**
 * Changes a user's password, finding the user by their UID
 */
const changeUserPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        (0, validationErrorParser_1.default)(errors);
        const { password } = req.body;
        const { uid } = req.params;
        const updatedUser = yield firebase_1.firebaseAuth.updateUser(uid, {
            password,
        });
        yield (0, emails_1.sendPasswordChangedEmailToAdmin)(updatedUser.email);
        res.status(200).json(updatedUser);
    }
    catch (error) {
        next(error);
    }
});
exports.changeUserPassword = changeUserPassword;
/**
 * Sends an email to notify the user that their password has been reset.
 */
const notifyResetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userUid } = req;
        const firebaseUser = yield firebase_1.firebaseAuth.getUser(userUid);
        yield (0, emails_1.sendOwnPasswordChangedNotificationEmail)(firebaseUser.email);
        yield (0, emails_1.sendPasswordChangedEmailToAdmin)(firebaseUser.email);
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.notifyResetPassword = notifyResetPassword;
/**
 * Deletes a user from the Firebase and MongoDB databases
 */
const deleteUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { uid } = req.params;
        yield firebase_1.firebaseAuth.deleteUser(uid);
        const deletedUser = yield user_1.default.deleteOne({ uid });
        if (deletedUser === null) {
            throw (0, http_errors_1.default)(404, "User not found at uid " + uid);
        }
        return res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteUser = deleteUser;
