"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isValidLogin;
const validator_1 = __importDefault(require("validator"));
function isValidLogin(login) {
    try {
        return validator_1.default.isEmail(login.email) && validator_1.default.isStrongPassword(login.password);
    }
    catch (error) {
        return false;
    }
}
