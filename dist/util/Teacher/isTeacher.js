"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isTeacher;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function isTeacher(token) {
    const decoded = jsonwebtoken_1.default.decode(token);
    return decoded.isadm == "teacher";
}
