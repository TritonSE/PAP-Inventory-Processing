"use strict";
/**
 * Parses .env parameters and ensures they are of required types and are not missing.
 * If any .env parameters are missing, the server will not start and an error will be thrown.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const envalid_1 = require("envalid");
const validators_1 = require("envalid/dist/validators");
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    PORT: (0, validators_1.port)(),
    MONGODB_URI: (0, validators_1.str)(),
    FRONTEND_ORIGIN: (0, validators_1.str)(),
    EMAIL_USER: (0, validators_1.email)(),
    EMAIL_APP_PASSWORD: (0, validators_1.str)(),
    EMAIL_NOTIFICATIONS_RECIPIENT: (0, validators_1.email)(),
    BACKEND_FIREBASE_SETTINGS: (0, validators_1.json)(),
    SERVICE_ACCOUNT_KEY: (0, validators_1.json)(), // Private service account key for backend, stored as a JSON string
});
