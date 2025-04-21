"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Canlendar_1 = __importDefault(require("../services/Canlendar"));
const isAdmin_1 = __importDefault(require("../util/Admin/isAdmin"));
const isValid_1 = __importDefault(require("../util/Calendar/isValid"));
const isTeacher_1 = __importDefault(require("../util/Teacher/isTeacher"));
const CalendarController = {
    delete: async function (req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            const id = Number(req.params.id);
            const data = await Canlendar_1.default.delete(id);
            res.status(200).json({
                deleted: data,
            });
            return;
        }
        else {
            res.status(403).json({
                msg: "doesnt have permition",
            });
            return;
        }
    },
    get: async function (req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            const teacher_id = Number(req.params.id);
            const data = await Canlendar_1.default.get(teacher_id);
            res.status(200).json({
                data,
            });
            return;
        }
        else {
            res.status(403).json({
                msg: "doesnt have permition",
            });
            return;
        }
    },
    getbytoken: async function (req, res) {
        const token = req.body.token;
        if ((0, isTeacher_1.default)(token)) {
            const id = Number(req.body.userid);
            const data = await Canlendar_1.default.get(id);
            res.status(200).json(data);
            return;
        }
        else {
            res.status(403).json({
                msg: "doesnt have permition",
            });
            return;
        }
    },
    create: async function (req, res) {
        const token = req.body.token;
        const teacher_id = Number(req.params.id);
        if ((0, isAdmin_1.default)(token)) {
            const calendar = req.body;
            calendar.teacher_id = teacher_id;
            const isvalid = await (0, isValid_1.default)(calendar);
            if (isvalid == "valid") {
                const data = await Canlendar_1.default.create(calendar);
                res.status(201).json({ data });
                return;
            }
            else {
                res.status(400).json({
                    error: isvalid,
                });
                return;
            }
        }
        else {
            res.status(403).json({
                msg: "doesnt have permition",
            });
            return;
        }
    },
};
exports.default = CalendarController;
