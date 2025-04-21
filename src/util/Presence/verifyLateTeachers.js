"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = veriFyMissingTeachers;
const dbConnection_1 = __importDefault(require("../../database/dbConnection"));
async function veriFyMissingTeachers() {
    const weekDays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];
    const date = new Date();
    const today = weekDays[date.getDay()];
    let query = "SELECT * FROM calendar WHERE week_day = $1";
    const { rowCount, rows } = await dbConnection_1.default.query(query, [today]);
    const actminute = new Date().getMinutes();
    const hour = new Date().getHours();
    if (rowCount == 0) {
        console.log("No Pendete Teachers");
        return;
    }
    else {
        rows.map(async (teacher) => {
            const teacher_id = teacher.teacher_id;
            //verificar a presenca do mesmo
            query = "SELECT status FROM presence WHERE teacher_id = $1;";
            await dbConnection_1.default.query(query, [teacher_id], async (err, data) => {
                if (err) {
                    throw new Error(err.message);
                }
                if (data.rowCount == 0) {
                    if (hour <= rows[0].hour_start?.split(":")[0] && actminute >= 20) {
                        const query = "INSERT INTO presence(teacher_id , date , status ) VALUES($1 , $2 , $3 )";
                        await dbConnection_1.default.query(query, [rows[0].teacher_id, new Date().toLocaleDateString("pt"), 2]);
                    }
                    return;
                }
                data.rows.map(async (presence) => {
                    if (presence?.status == 3 && date.getHours() >= 19) {
                        query = "UPDATE presence SET status = 2 WHERE teacher_id = $1";
                        await dbConnection_1.default.query(query, [teacher_id]);
                    }
                });
            });
        });
        console.log("Professores verificados");
        return;
    }
}
