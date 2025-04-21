"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AdminService_1 = __importDefault(require("../services/AdminService"));
const isValid_1 = __importDefault(require("../util/Admin/isValid"));
const isValidLogin_1 = __importDefault(require("../util/Login/isValidLogin"));
const token_1 = __importDefault(require("../middlewares/token"));
const isAdmin_1 = __importDefault(require("../util/Admin/isAdmin"));
const isValidVariables_1 = __importDefault(require("../util/Admin/isValidVariables"));
const password_1 = require("../util/password");
const isAdminOwnerAcount_1 = __importDefault(require("../util/Admin/isAdminOwnerAcount"));
const AdminController = {
    async update(req, res) {
        const Admin = req.body;
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            const isvalid = (0, isValid_1.default)(Admin);
            if (isvalid == "valid") {
                (0, isAdminOwnerAcount_1.default)(Admin)
                    .then((data) => {
                    Admin.password = (0, password_1.Encrypt)(Admin.password);
                    AdminService_1.default.update(Admin);
                    res.status(201).json({
                        msg: "Perfil Altedado",
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
                    msg: isvalid,
                });
                return;
            }
        }
        else {
            res.status(403).json({
                msg: "Permissão inválida",
            });
            return;
        }
    },
    async get(req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            const data = await AdminService_1.default.get();
            res.status(201).json(data);
        }
        else {
            res.status(403).json({
                msg: "Permissão inválida",
            });
            return;
        }
    },
    async dashBoard(req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            const data = await AdminService_1.default.dahsBoard();
            res.status(201).json(data);
        }
        else {
            res.status(403).json({
                msg: "Permissão inválida",
            });
            return;
        }
    },
    async getAdminVariable(req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            const data = AdminService_1.default.getAdminVariable();
            res.status(201).json(data);
        }
        else {
            res.status(403).json({
                msg: "Permissão inválida",
            });
            return;
        }
    },
    async updateAdminVariable(req, res) {
        const token = req.body.token;
        const admimVariables = req.body;
        if ((0, isAdmin_1.default)(token)) {
            if ((0, isValidVariables_1.default)(admimVariables) == "valid") {
                const data = AdminService_1.default.UpdateAdminVariable(admimVariables.coord, admimVariables.teacher);
                res.status(201).json({ data });
                return;
            }
            else {
                res.status(400).json({ smg: "Váriáveis inválidas" });
                return;
            }
        }
        else {
            res.status(403).json({
                msg: "Permissão inválida",
            });
            return;
        }
    },
    async login(req, res) {
        const login = req.body;
        const isvalid = (0, isValidLogin_1.default)(login);
        if (isvalid) {
            const response = await AdminService_1.default.login(login);
            if (isNaN(response)) {
                res.status(400).json({
                    error: "Credenciais incorretas",
                });
                return;
            }
            const token = (0, token_1.default)(response, "admin");
            res.status(200).json({
                token,
                msg: "Bem vindo admin",
            });
            return;
        }
        else {
            res.status(400).json({
                error: "Seu email ou senha está incorreto",
            });
            return;
        }
    },
};
exports.default = AdminController;
