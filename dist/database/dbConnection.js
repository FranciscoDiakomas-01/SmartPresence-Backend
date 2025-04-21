"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const db = new pg_1.Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    port: Number(process.env.DBPORT),
    database: process.env.DATABASE,
    password: process.env.DBPASSWORD
});
exports.default = db;
