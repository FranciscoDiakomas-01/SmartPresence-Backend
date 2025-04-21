"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GenerateToken;
exports.extractIdInTokem = extractIdInTokem;
exports.verify = verify;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function GenerateToken(id, isadm) {
    const token = jsonwebtoken_1.default.sign({ id, isadm }, String(process.env.JWT));
    return token;
}
function extractIdInTokem(token) {
    try {
        const decodetoken = jsonwebtoken_1.default.decode(token);
        return decodetoken;
    }
    catch (error) {
        return error;
    }
}
function verify(token) {
    try {
        const isvAdminToken = jsonwebtoken_1.default.verify(token, String(process.env.JWT));
        return isvAdminToken;
    }
    catch (error) {
        return error;
    }
}
