"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    role: {
        type: String,
        required: true,
    },
    uid: {
        type: String,
        required: true,
    },
});
var UserRole;
(function (UserRole) {
    /**
     * For some reason we are getting ESLint errors about these vars not being used,
     * even though they are used in other files. Disable these ESLint errors.
     */
    // eslint-disable-next-line no-unused-vars
    UserRole["STAFF"] = "staff";
    // eslint-disable-next-line no-unused-vars
    UserRole["ADMIN"] = "admin";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.default = (0, mongoose_1.model)("User", userSchema);
