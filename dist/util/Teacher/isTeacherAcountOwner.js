"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isTeacherAcountOwner;
const dbConnection_1 = __importDefault(require("../../database/dbConnection"));
const password_1 = require("../password");
async function isTeacherAcountOwner(teacher) {
    const query = "SELECT id , email , password  FROM teacher WHERE id = $1 LIMIT 1;";
    return new Promise(async (resolve, reject) => {
        try {
            const { rowCount, rows } = await dbConnection_1.default.query(query, [teacher?.id]);
            if (rowCount == 0 || rowCount == null) {
                reject("Conta não encotrada");
                return;
            }
            else {
                if (teacher?.oldemail == rows[0]?.email) {
                    const decrypedPassword = (0, password_1.Decrypt)(String(rows[0]?.password));
                    if (decrypedPassword == teacher?.oldpassword) {
                        resolve("owner");
                        return;
                    }
                    else {
                        reject("As senhas não combinam");
                        return;
                    }
                }
                else {
                    reject("Os emails não combinam");
                    return;
                }
            }
        }
        catch (error) {
            reject("error");
        }
    });
}
