"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isValidPresence;
const dbConnection_1 = __importDefault(require("../../database/dbConnection"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
async function isValidPresence(presence) {
    try {
        const payload = jsonwebtoken_1.default.verify(presence.token_teacher, String(process.env.JWT));
        const { id, isadm } = payload;
        const weekDays = [
            "Domingo",
            "Segunda-feira",
            "Terça-feira",
            "Quarta-feira",
            "Quinta-feira",
            "Sexta-feira",
            "Sábado",
        ];
        const date = new Date();
        const today = weekDays[date.getDay()];
        const { rowCount: isPendete, rows } = await dbConnection_1.default.query("SELECT * FROM presence WHERE status = 3 AND teacher_id = $1", [id]);
        console.log(rows);
        if (isPendete != null && isPendete != 0) {
            return "Presença Pendente encotrada";
        }
        if (isadm == "teacher") {
            const { rowCount } = await dbConnection_1.default.query("SELECT name FROM teacher WHERE id = $1;", [id]);
            if (rowCount == 0) {
                return "Professor não encotrado";
            }
            const { rows } = await dbConnection_1.default.query("SELECT id , hour_start FROM calendar WHERE week_day = $1 AND teacher_id = $2", [today, id]);
            const hour = String(rows[0]?.hour_start).split(":")[0];
            if (rows.length == 0) {
                return "O professor não possui ocupação";
            }
            const diff = Number(Number(hour) - Number(presence.hour));
            if (diff >= 1) {
                return "Hora inválida";
            }
            return "valid";
        }
        else {
            return "Erro na leitura";
        }
    }
    catch (error) {
        return "Token inválido";
    }
}
