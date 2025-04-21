"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const isValid_1 = __importDefault(require("../util/Presence/isValid"));
const isAdmin_1 = __importDefault(require("../util/Admin/isAdmin"));
const PresnceService_1 = __importDefault(require("../services/PresnceService"));
const token_1 = require("../middlewares/token");
const isTeacher_1 = __importDefault(require("../util/Teacher/isTeacher"));
const isCoord_1 = __importDefault(require("../util/Coord/isCoord"));
const dbConnection_1 = __importDefault(require("../database/dbConnection"));
const PresenceController = {
    create: async function (req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token) || (0, isCoord_1.default)(token)) {
            const presence = req.body;
            const ivalid = await (0, isValid_1.default)(presence);
            if (ivalid == "valid") {
                const id = (0, token_1.extractIdInTokem)(presence.token_teacher);
                presence.teacher_id = id.id;
                await PresnceService_1.default.create(presence);
                res.status(201).json({
                    msg: "Seja Bem Vindo Professor",
                });
                return;
            }
            else {
                res.status(400).json({
                    error: ivalid,
                });
                return;
            }
        }
        else {
            res.status(403).json({
                error: "Permisão recusada",
            });
            return;
        }
    },
    update: async function (req, res) {
        const token = req.body.token;
        const teachertoken = req.body.token_teacher;
        const date1 = req.body.date;
        const hour = Number(req.body.hour);
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
        try {
            const teacherId = (0, token_1.extractIdInTokem)(teachertoken);
            if (!teacherId?.id || teacherId?.isadm != "teacher") {
                res.status(400).json({
                    error: "Token inválido",
                });
                return;
            }
            if (!teachertoken || !date1 || Number.isNaN(hour) || !hour) {
                res.status(400).json({
                    error: "Dados não providenciado",
                });
                return;
            }
            if ((0, isAdmin_1.default)(token) || (0, isCoord_1.default)(token)) {
                //verificar se esta na hora dele confirmar a presença
                const { rows: response, rowCount } = await dbConnection_1.default.query("SELECT hour_end FROM calendar WHERE teacher_id = $1 AND week_day = $2", [teacherId?.id, today]);
                if (rowCount == 0 || rowCount == null) {
                    res.status(400).json({
                        error: "Não possuí ocupação",
                    });
                    return;
                }
                const hour_end = Number(String(response[0]?.hour_end).split(":")[0]);
                if (hour_end > hour) {
                    res.status(400).json({
                        error: "Ainda é cedo de mais!",
                    });
                    return;
                }
                const { rows } = await dbConnection_1.default.query("SELECT * FROM presence WHERE status = 3 AND teacher_id = $1 ORDER BY id DESC LIMIT 1;", [teacherId?.id]);
                if (rows.length == 0) {
                    res.status(400).json({
                        error: "O professor ainda não foi registrado",
                    });
                    return;
                }
                const newdate = rows[0]?.date + " --- " + date1;
                const presenceid = rows[0]?.id;
                await PresnceService_1.default.update(presenceid, newdate);
                res.status(200).json({
                    msg: "Até logo Professor",
                });
                return;
            }
            else {
                res.status(403).json({
                    error: "Permisão recusada",
                });
                return;
            }
        }
        catch (error) {
            console.log(error);
            res.status(403).json({
                error: "Token inválido",
            });
            return;
        }
    },
    get: async function (req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            let page = Number(req.query.page);
            let limit = Number(req.query.limit);
            page = Number.isNaN(page) || page < 0 ? 1 : page;
            limit = Number.isNaN(limit) || limit < 0 ? 15 : limit;
            const data = await PresnceService_1.default.getLatest(limit, page);
            res.status(200).json(data);
        }
        else {
            res.status(403).json({
                msg: "Permisão recusada",
            });
        }
        return;
    },
    getbyTeacher: async function (req, res) {
        const token = req.body.token;
        const teacherid = Number(req.params.id);
        if (Number.isNaN(teacherid)) {
            res.status(400).json({
                error: "invalid teacher id",
            });
        }
        if ((0, isAdmin_1.default)(token)) {
            let page = Number(req.query.page);
            let limit = Number(req.query.limit);
            page = Number.isNaN(page) || page < 0 ? 1 : page;
            limit = Number.isNaN(limit) || limit < 0 ? 15 : limit;
            const data = await PresnceService_1.default.getByteacherId(teacherid, limit, page);
            res.status(200).json(data);
        }
        else {
            res.status(403).json({
                msg: "Permisão recusada",
            });
        }
        return;
    },
    getByTeacherToken: async function (req, res) {
        const token = req.body.token;
        const teacherid = Number(req.body.userid);
        if (Number.isNaN(teacherid)) {
            res.status(400).json({
                error: "invalid teacher id",
            });
        }
        if ((0, isTeacher_1.default)(token)) {
            let page = Number(req.query.page);
            let limit = Number(req.query.limit);
            page = Number.isNaN(page) || page < 0 ? 1 : page;
            limit = Number.isNaN(limit) || limit < 0 ? 15 : limit;
            const data = await PresnceService_1.default.getByteacherId(teacherid, limit, page);
            res.status(200).json(data);
        }
        else {
            res.status(403).json({
                msg: "Permisão recusada",
            });
        }
        return;
    },
};
exports.default = PresenceController;
