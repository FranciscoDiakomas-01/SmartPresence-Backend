import IUser from "../models/User";
import TeacherService from "../services/TeacherService";
import { Request, Response } from "express";
import isValid from "../util/Coord/isValid";
import { Encrypt } from "../util/password";
import isAdmin from "../util/Admin/isAdmin";
import type ILogin from "../types/ILogin";
import isValidLogin from "../util/Login/isValidLogin";
import isTeacher from "../util/Teacher/isTeacher";
import GenerateToken, { extractIdInTokem } from "../middlewares/token";
import isTeacherAcountOwner from "../util/Teacher/isTeacherAcountOwner";
import fs from "node:fs";
import validator from "validator";
import path from "node:path";
import VacationDiff from "../util/Calendar/isValidVacation";

const TeacherController = {
  get: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      page = Number.isNaN(page) || page < 0 ? 1 : page;
      limit = Number.isNaN(limit) || limit < 0 ? 15 : limit;
      const data = await TeacherService.getAll(limit, page);
      res.status(200).json(data);
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
    }
    return;
  },
  getAll: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      let limit = Number(req.query.limit);
      const data = await TeacherService.getAllNames(limit);
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
      const data = await TeacherService.getAllBySearchText(limit, page, filter);
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
      const data = await TeacherService.delete(id);
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
    if (isTeacher(token) || isAdmin(token)) {
      const id = Number(req.body.userid);
      const data = await TeacherService.getbyid(id);
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
    const defaultTacherPassword = fs
      .readFileSync(path.join(process.cwd() + "/config/teacher.txt"))
      .toString();
    if (isAdmin(token)) {
      const teacher: IUser = req.body;
      teacher.password = Encrypt(defaultTacherPassword);
      const isvalid = isValid(teacher);
      if (isvalid == "valid") {
        TeacherService.create(teacher)
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
    const teacher: IUser = req.body;
    const id = Number(req.body.userid);
    const token: string = req.body.token;
    const iscord = isTeacher(token);
    teacher.id = id;
    if (iscord) {
      const isvalid = isValid(teacher);
      if (isvalid == "valid") {
        isTeacherAcountOwner(teacher)
          .then(async (msg) => {
            await TeacherService.update(teacher);
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
      const status = Number(req.body.status);
      let vacation = req.body.vacation;
      const response = VacationDiff(vacation);
      if (!VacationDiff(vacation)) {
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
        await TeacherService.toogleStatus(id, status, vacation);
        res.status(200).json({
          updated: true,
        });
        return;
      } else {
        res.status(400).json({
          error: response,
        });
      }
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
      const response = await TeacherService.login(login);
      if (isNaN(response)) {
        res.status(400).json({
          error: "Credenciais incorretas",
        });
        return;
      }
      const token = GenerateToken(response, "teacher");
      res.status(200).json({
        token,
        msg: "wellcome teacher",
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
export default TeacherController;
