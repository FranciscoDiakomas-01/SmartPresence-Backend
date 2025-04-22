"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TeacherService_1 = __importDefault(require("../services/TeacherService"));
const isValid_1 = __importDefault(require("../util/Coord/isValid"));
const password_1 = require("../util/password");
const isAdmin_1 = __importDefault(require("../util/Admin/isAdmin"));
const isValidLogin_1 = __importDefault(require("../util/Login/isValidLogin"));
const isTeacher_1 = __importDefault(require("../util/Teacher/isTeacher"));
const token_1 = __importDefault(require("../middlewares/token"));
const isTeacherAcountOwner_1 = __importDefault(require("../util/Teacher/isTeacherAcountOwner"));
const validator_1 = __importDefault(require("validator"));
const isValidVacation_1 = __importDefault(require("../util/Calendar/isValidVacation"));
const TeacherController = {
    get: async function (req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            let page = Number(req.query.page);
            let limit = Number(req.query.limit);
            page = Number.isNaN(page) || page < 0 ? 1 : page;
            limit = Number.isNaN(limit) || limit < 0 ? 15 : limit;
            const data = await TeacherService_1.default.getAll(limit, page);
            res.status(200).json(data);
        }
        else {
            res.status(403).json({
                msg: "doesnt have permition",
            });
        }
        return;
    },
    getAll: async function (req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            let limit = Number(req.query.limit);
            const data = await TeacherService_1.default.getAllNames(limit);
            res.status(200).json(data);
        }
        else {
            res.status(403).json({
                msg: "doesnt have permition",
            });
        }
        return;
    },
    getbySearchText: async function (req, res) {
        const token = req.body.token;
        const filter = req.params.search;
        if (!filter || validator_1.default.isNumeric(filter)) {
            res.status(400).json({ error: "invalid search" });
            return;
        }
        if ((0, isAdmin_1.default)(token)) {
            let page = Number(req.query.page);
            let limit = Number(req.query.limit);
            page = Number.isNaN(page) ? 1 : page;
            limit = Number.isNaN(limit) ? 20 : limit;
            const data = await TeacherService_1.default.getAllBySearchText(limit, page, filter);
            res.status(200).json(data);
        }
        else {
            res.status(403).json({
                msg: "doesnt have permition",
            });
        }
        return;
    },
    delete: async function (req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            const id = Number(req.params.id);
            const data = await TeacherService_1.default.delete(id);
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
    getbyid: async function (req, res) {
        const token = req.body.token;
       const id = Number(req.body.userid);
            const data = await TeacherService_1.default.getbyid(id);
            res.status(200).json({
                data,
            });
            return;
    },
    create: async function (req, res) {
        const token = req.body.token;
        const defaultTacherPassword = "Professor@01";
        if ((0, isAdmin_1.default)(token)) {
            const teacher = req.body;
            teacher.password = (0, password_1.Encrypt)(defaultTacherPassword);
            const isvalid = (0, isValid_1.default)(teacher);
            if (isvalid == "valid") {
                TeacherService_1.default.create(teacher)
                    .then((data) => {
                    res.status(200).json({
                        msg: data,
                    });
                    return;
                })
                    .catch((err) => {
                    res.status(400).json({
                        msg: err,
                    });
                    return;
                });
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
    update: async function (req, res) {
        const teacher = req.body;
        const id = Number(req.body.userid);
        const token = req.body.token;
        const iscord = (0, isTeacher_1.default)(token);
        teacher.id = id;
        if (iscord) {
            const isvalid = (0, isValid_1.default)(teacher);
            if (isvalid == "valid") {
                (0, isTeacherAcountOwner_1.default)(teacher)
                    .then(async (msg) => {
                    await TeacherService_1.default.update(teacher);
                    res.status(200).json({
                        msg: "updated",
                    });
                    return;
                })
                    .catch((err) => {
                    res.status(403).json({
                        msg: err,
                    });
                    return;
                });
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
    toogle: async function (req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            const id = Number(req.body.id);
            const status = Number(req.body.status);
            let vacation = req.body.vacation;
            const response = (0, isValidVacation_1.default)(vacation);
            if (!(0, isValidVacation_1.default)(vacation)) {
                res.status(400).json({
                    error: "invalid vacation",
                });
                return;
            }
            if (response == "apto") {
                vacation = status != 3 ? "no" : vacation;
                if (!id || Number.isNaN(id)) {
                    res.status(400).json({
                        error: "invalid id",
                    });
                    return;
                }
                await TeacherService_1.default.toogleStatus(id, status, vacation);
                res.status(200).json({
                    updated: true,
                });
                return;
            }
            else {
                res.status(400).json({
                    error: response,
                });
            }
        }
        else {
            res.status(403).json({
                msg: "doesnt have permition",
            });
            return;
        }
    },
    async login(req, res) {
        const login = req.body;
        const isvalid = (0, isValidLogin_1.default)(login);
        if (isvalid) {
            const response = await TeacherService_1.default.login(login);
            if (isNaN(response)) {
                res.status(400).json({
                    error: "Credenciais incorretas",
                });
                return;
            }
            const token = (0, token_1.default)(response, "teacher");
            res.status(200).json({
                token,
                msg: "wellcome teacher",
            });
            return;
        }
        else {
            res.status(400).json({
                error: "invalid email or password",
            });
            return;
        }
    },
};
exports.default = TeacherController;
