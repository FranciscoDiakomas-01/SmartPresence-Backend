"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CoordService_1 = __importDefault(require("../services/CoordService"));
const isValid_1 = __importDefault(require("../util/Coord/isValid"));
const password_1 = require("../util/password");
const isAdmin_1 = __importDefault(require("../util/Admin/isAdmin"));
const isCoord_1 = __importDefault(require("../util/Coord/isCoord"));
const isValidLogin_1 = __importDefault(require("../util/Login/isValidLogin"));
const token_1 = __importDefault(require("../middlewares/token"));
const isCoordAcountOwner_1 = __importDefault(require("../util/Coord/isCoordAcountOwner"));
const node_fs_1 = __importDefault(require("node:fs"));
const validator_1 = __importDefault(require("validator"));
const node_path_1 = __importDefault(require("node:path"));
const CoordController = {
    get: async function (req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            let page = Number(req.query.page);
            let limit = Number(req.query.limit);
            page = Number.isNaN(page) || page == 0 ? 1 : page;
            limit = Number.isNaN(limit) || limit == 0 ? 20 : limit;
            const data = await CoordService_1.default.getAll(limit, page);
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
            const data = await CoordService_1.default.getAllBySearchText(filter);
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
            const data = await CoordService_1.default.delete(id);
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
        if ((0, isCoord_1.default)(token) || (0, isAdmin_1.default)(token)) {
            const id = Number(req.body.userid);
            const data = await CoordService_1.default.getbyid(id);
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
    create: async function (req, res) {
        const token = req.body.token;
        const defaultCoordPassword = node_fs_1.default
            .readFileSync(node_path_1.default.join(process.cwd() + "/config/coord.txt"))
            .toString();
        if ((0, isAdmin_1.default)(token)) {
            const coord = req.body;
            coord.password = (0, password_1.Encrypt)(defaultCoordPassword);
            const isvalid = (0, isValid_1.default)(coord);
            if (isvalid == "valid") {
                CoordService_1.default.create(coord)
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
        const coord = req.body;
        const id = Number(req.body.userid);
        const token = req.body.token;
        const iscord = (0, isCoord_1.default)(token);
        coord.id = id;
        if (iscord) {
            const isvalid = (0, isValid_1.default)(coord);
            if (isvalid == "valid") {
                (0, isCoordAcountOwner_1.default)(coord)
                    .then(async (msg) => {
                    await CoordService_1.default.update(coord);
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
                msg: "Permisão recusada",
            });
            return;
        }
    },
    toogle: async function (req, res) {
        const token = req.body.token;
        if ((0, isAdmin_1.default)(token)) {
            const id = Number(req.body.id);
            const status = Boolean(req.body.status);
            if (!id || Number.isNaN(id)) {
                res.status(400).json({
                    error: "invalid id",
                });
                return;
            }
            await CoordService_1.default.toogleStatus(id, status);
            res.status(200).json({
                updated: true,
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
    async login(req, res) {
        const login = req.body;
        const isvalid = (0, isValidLogin_1.default)(login);
        if (isvalid) {
            const response = await CoordService_1.default.login(login);
            if (isNaN(response)) {
                res.status(400).json({
                    error: "Credenciais inválidas",
                });
                return;
            }
            const token = (0, token_1.default)(response, "coord");
            res.status(200).json({
                token,
                msg: "wellcome coord",
            });
            return;
        }
        else {
            res.status(400).json({
                error: "Email ou senha inválida",
            });
            return;
        }
    },
};
exports.default = CoordController;
