"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CoordController_1 = __importDefault(require("../controllers/CoordController"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const CoordRouter = (0, express_1.Router)();
CoordRouter.get("/coords", auth_1.default, CoordController_1.default.get);
CoordRouter.get("/coords/search/:search", auth_1.default, CoordController_1.default.getbySearchText);
CoordRouter.get("/coord", auth_1.default, CoordController_1.default.getbyid);
CoordRouter.post("/coord", auth_1.default, CoordController_1.default.create);
CoordRouter.post("/coord/login", CoordController_1.default.login);
CoordRouter.put("/coord", auth_1.default, CoordController_1.default.update);
CoordRouter.put("/coordstatus", auth_1.default, CoordController_1.default.toogle);
CoordRouter.delete("/coord/:id", auth_1.default, CoordController_1.default.delete);
exports.default = CoordRouter;
