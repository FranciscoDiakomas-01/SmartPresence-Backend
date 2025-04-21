"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isAdminAcountOwner;
const dbConnection_1 = __importDefault(require("../../database/dbConnection"));
const password_1 = require("../password");
async function isAdminAcountOwner(admin) {
    const query = "SELECT id , email , password  FROM admin LIMIT 1;";
    return new Promise(async (resolve, reject) => {
        try {
            const { rowCount, rows } = await dbConnection_1.default.query(query);
            if (rowCount == 0 || rowCount == null) {
                reject("Conta não encotrada");
                return;
            }
            else {
                if (admin?.oldemail == rows[0]?.email) {
                    const decrypedPassword = (0, password_1.Decrypt)(String(rows[0]?.password));
                    if (decrypedPassword == admin?.oldpassword) {
                        resolve("owner");
                        return;
                    }
                    else {
                        reject("Palavras passe não batem");
                        return;
                    }
                }
                else {
                    reject("Email não batem");
                    return;
                }
            }
        }
        catch (error) {
            reject("error");
        }
    });
}
