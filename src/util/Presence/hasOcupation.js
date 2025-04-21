"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = hasOcupation;
const dbConnection_1 = __importDefault(require("../../database/dbConnection"));
async function hasOcupation(teacher_id, week_day) {
    let query = "SELECT id FROM calendar WHERE teacher_id = $1 AND wee_day = $2 LIMIT 1;";
    try {
        const { rowCount } = await dbConnection_1.default.query(query, [teacher_id, week_day]);
        query = "SELECT status FROM teacher WHERE id = $1 LIMIT 1;";
        const { rows } = await dbConnection_1.default.query(query, [teacher_id]);
        if (rowCount != 0 && rows[0].status == 1) {
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        return false;
    }
}
