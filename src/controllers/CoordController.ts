import type IUser from "../models/User";
import CoordSerice from "../services/CoordService";
import { Request, Response } from "express";
import isValidCoord from "../util/Coord/isValid";
import { Encrypt } from "../util/password";
import isAdmin from "../util/Admin/isAdmin";
import isCoord from "../util/Coord/isCoord";
import type ILogin from "../types/ILogin";
import isValidLogin from "../util/Login/isValidLogin";
import GenerateToken from "../middlewares/token";
import isCoorAcountOwner from "../util/Coord/isCoordAcountOwner";
import fs from "node:fs";
import validator from "validator";
import path from "node:path";

const CoordController = {
  get: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      page = Number.isNaN(page) ? 1 : page;
      limit = Number.isNaN(limit) ? 20 : limit;
      const data = await CoordSerice.getAll(limit, page);
      res.status(200).json(data);
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
    }
    return;
  },

  getbySearchText: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    const filter = req.params.search;
    if (!filter || validator.isNumeric(filter)) {
      res.status(400).json({ error: "invalid search" });
      return;
    }
    if (isAdmin(token)) {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      page = Number.isNaN(page) ? 1 : page;
      limit = Number.isNaN(limit) ? 20 : limit;
      const data = await CoordSerice.getAllBySearchText(limit, page, filter);
      res.status(200).json(data);
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
    }
    return;
  },

  delete: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const id = Number(req.params.id);
      const data = await CoordSerice.delete(id);
      res.status(200).json({
        deleted: data,
      });
      return;
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return;
    }
  },

  getbyid: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isCoord(token) || isAdmin(token)) {
      const id = Number(req.body.userid);
      const data = await CoordSerice.getbyid(id);
      res.status(200).json({
        data,
      });
      return;
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return;
    }
  },

  create: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    const defaultCoordPassword = fs
      .readFileSync(path.join(process.cwd() + "/config/coord.txt"))
      .toString();
    if (isAdmin(token)) {
      const coord: IUser = req.body;
      coord.password = Encrypt(defaultCoordPassword);
      const isvalid = isValidCoord(coord);
      if (isvalid == "valid") {
        CoordSerice.create(coord)
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
      } else {
        res.status(400).json({
          error: isvalid,
        });
        return;
      }
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return;
    }
  },

  update: async function (req: Request, res: Response) {
    const coord: IUser = req.body;
    const id = Number(req.body.userid);
    const token: string = req.body.token;
    const iscord = isCoord(token);
    coord.id = id;
    if (iscord) {
      const isvalid = isValidCoord(coord);
      if (isvalid == "valid") {
        isCoorAcountOwner(coord)
          .then(async (msg) => {
            await CoordSerice.update(coord);
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
      } else {
        res.status(400).json({
          error: isvalid,
        });
        return;
      }
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return;
    }
  },

  toogle: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const id = Number(req.body.id);
      const status = Boolean(req.body.status);
      if (!id || Number.isNaN(id)) {
        res.status(400).json({
          error: "invalid id",
        });
        return;
      }
      await CoordSerice.toogleStatus(id, status);
      res.status(200).json({
        updated: true,
      });
      return;
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return;
    }
  },
  async login(req: Request, res: Response) {
    const login: ILogin = req.body;
    const isvalid = isValidLogin(login);
    if (isvalid) {
      const response = await CoordSerice.login(login);
      if (isNaN(response)) {
        res.status(400).json({
          msg: "wrong credentials coord",
        });
        return;
      }
      const token = GenerateToken(response, "coord");
      res.status(200).json({
        token,
        msg: "wellcome coord",
      });
      return;
    } else {
      res.status(400).json({
        error: "invalid email or password",
      });
      return;
    }
  },
};
export default CoordController;
