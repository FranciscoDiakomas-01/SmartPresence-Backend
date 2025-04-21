"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VerifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function VerifyToken(req, res, next) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1];
        if (!token) {
            res.status(402).json({
                error: "token not provided",
            });
            return;
        }
        const verified = jsonwebtoken_1.default.verify(token, String(process.env.JWT));
        req.body.userid = verified.id;
        req.body.token = token;
        next();
        return;
    }
    catch (error) {
        res.status(402).json({
            error: "invalid token",
        });
        return;
    }
}
