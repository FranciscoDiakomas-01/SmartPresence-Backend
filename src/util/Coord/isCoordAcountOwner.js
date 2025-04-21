"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isCoorAcountOwner;
const dbConnection_1 = __importDefault(require("../../database/dbConnection"));
const password_1 = require("../password");
async function isCoorAcountOwner(coord) {
    const query = "SELECT id , email , password  FROM coord WHERE id = $1 LIMIT 1;";
    return new Promise(async (resolve, reject) => {
        try {
            const { rowCount, rows } = await dbConnection_1.default.query(query, [coord?.id]);
            if (rowCount == 0 || rowCount == null) {
                reject("Conta não encotrada");
                return;
            }
            else {
                if (coord?.oldemail == rows[0]?.email) {
                    const decrypedPassword = (0, password_1.Decrypt)(String(rows[0]?.password));
                    if (decrypedPassword == coord?.oldpassword) {
                        resolve("owner");
                        return;
                    }
                    else {
                        reject("Palavras passe incorreta");
                        return;
                    }
                }
                else {
                    reject("Email incorreto");
                    return;
                }
            }
        }
        catch (error) {
            reject("error");
        }
    });
}
