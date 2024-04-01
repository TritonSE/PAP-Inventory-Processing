"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
class CustomError extends Error {
    constructor(code, status, message) {
        super(message);
        this.code = code;
        this.status = status;
        this.message = message;
        this.context = [];
    }
    displayMessage(clientFacing) {
        if (clientFacing) {
            return `${this.message}`;
        }
        return `Error: Type ${this.constructor.name}, Code ${this.code}, Context: ${this.context.length ? "\n" + this.context.join("\n\n") : null}`;
    }
}
exports.CustomError = CustomError;
