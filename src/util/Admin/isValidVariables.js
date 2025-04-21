"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isValidAdminVariables;
const validator_1 = __importDefault(require("validator"));
function isValidAdminVariables(Admin) {
    try {
        return validator_1.default.isStrongPassword(Admin.coord) && validator_1.default.isStrongPassword(Admin.teacher) ? "valid" : "invalid";
    }
    catch (error) {
        return "invalid";
    }
}
