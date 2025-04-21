"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isValiCalendar;
const dbConnection_1 = __importDefault(require("../../database/dbConnection"));
const hourDiff_1 = __importDefault(require("./hourDiff"));
async function isValiCalendar(calendar) {
    const { rowCount, rows } = await dbConnection_1.default.query("SELECT * FROM calendar WHERE teacher_id = $1", [calendar.teacher_id]);
    const total_daysInWork = Number(rowCount);
    const weekDays = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"];
    try {
        const alreadyExist = rows.map(date => {
            return date?.week_day == calendar?.week_day && date?.hour_start == calendar?.hour_start;
        });
        const has = alreadyExist.some((date) => { return date == true; });
        if (has) {
            return "already in use";
        }
        if ((0, hourDiff_1.default)(calendar.hour_start, calendar.hour_end) < 1) {
            return "invalid hour";
        }
        if (!weekDays.includes(calendar?.week_day)) {
            return "invalid day";
        }
        else if (total_daysInWork >= 5) {
            return "already busy";
        }
        else {
            return "valid";
        }
    }
    catch (error) {
    }
}
