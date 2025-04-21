"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = InsertDeFaultAdmin;
const dbConnection_1 = __importDefault(require("./dbConnection"));
const dotenv_1 = __importDefault(require("dotenv"));
const password_1 = require("../util/password");
dotenv_1.default.config();
async function InsertDeFaultAdmin() {
    const password = (0, password_1.Encrypt)(String(process.env.ADMPASS));
    const admin = {
        email: String(process.env.ADMEMAIL),
        password: password,
        name: "Francisco",
        lastname: "Diakomas",
    };
    const { rowCount } = await dbConnection_1.default.query("SELECT id FROM admin;");
    if (rowCount == 0) {
        await dbConnection_1.default.query("DELETE FROM teacher");
        await dbConnection_1.default.query("DELETE FROM coord");
        await dbConnection_1.default.query("DELETE FROM presence");
        await dbConnection_1.default.query("DELETE FROM calendar");
        await dbConnection_1.default.query("INSERT INTO admin(name , lastname , email , password) VALUES($1 , $2 ,$3 ,$4);", [admin.name, admin.lastname, admin.email, admin.password]);
    }
}
