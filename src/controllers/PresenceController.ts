import isValidPresence from "../util/Presence/isValid";
import { Request, Response } from "express";
import isAdmin from "../util/Admin/isAdmin";
import type IPresence from "../models/Presence";
import PresenceService from "../services/PresnceService";
import { extractIdInTokem } from "../middlewares/token";
import isTeacher from "../util/Teacher/isTeacher";
import isCoord from "../util/Coord/isCoord";
import db from "../database/dbConnection";

const PresenceController = {
  create: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token) || isCoord(token)) {
      const presence: IPresence = req.body;
      const ivalid = await isValidPresence(presence);
      if (ivalid == "valid") {
        const id = extractIdInTokem(presence.token_teacher) as { id: number };
        presence.teacher_id = id.id;
        await PresenceService.create(presence);
        res.status(201).json({
          msg: "Seja Bem Vindo Professor",
        });
        return;
      } else {
        res.status(400).json({
          error: ivalid,
        });
        return;
      }
    } else {
      res.status(403).json({
        error: "Permisão recusada",
      });
      return;
    }
  },

  update: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    const teachertoken: string = req.body.token_teacher;
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
      const teacherId = extractIdInTokem(teachertoken) as { id: number };
      if (!teachertoken || !date1 || Number.isNaN(hour) || !hour) {
        res.status(400).json({
          error: "Dados não providenciado",
        });
        return;
      }
      if (isAdmin(token) || isCoord(token)) {
        //verificar se esta na hora dele confirmar a presença
        const { rows: response, rowCount } = await db.query(
          "SELECT hour_end FROM calendar WHERE teacher_id = $1 AND week_day = $2",
          [teacherId?.id, today]
        );
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
        const { rows } = await db.query(
          "SELECT * FROM presence WHERE status = 3 AND teacher_id = $1 ORDER BY id DESC LIMIT 1;",
          [teacherId?.id]
        );
        if(rows.length == 0){
          res.status(400).json({
            error: "O professor ainda não foi registrado",
          });
          return;
        }
        const newdate = rows[0]?.date + " --- " + date1;
        const presenceid = rows[0]?.id;
        await PresenceService.update(presenceid, newdate);
        res.status(200).json({
          msg: "Até logo Professor",
        });
        return;
      } else {
        res.status(403).json({
          error: "Permisão recusada",
        });
        return;
      }
    } catch (error) {
      console.log(error);
      res.status(403).json({
        error: "Token inválido",
      });
      return;
    }
  },
  get: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      page = Number.isNaN(page) || page < 0 ? 1 : page;
      limit = Number.isNaN(limit) || limit < 0 ? 15 : limit;
      const data = await PresenceService.getLatest(limit, page);
      res.status(200).json(data);
    } else {
      res.status(403).json({
        msg: "Permisão recusada",
      });
    }
    return;
  },

  getbyTeacher: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    const teacherid = Number(req.params.id);
    if (Number.isNaN(teacherid)) {
      res.status(400).json({
        error: "invalid teacher id",
      });
    }
    if (isAdmin(token)) {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      page = Number.isNaN(page) || page < 0 ? 1 : page;
      limit = Number.isNaN(limit) || limit < 0 ? 15 : limit;
      const data = await PresenceService.getByteacherId(teacherid, limit, page);
      res.status(200).json(data);
    } else {
      res.status(403).json({
        msg: "Permisão recusada",
      });
    }
    return;
  },

  getByTeacherToken: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    const teacherid = Number(req.body.userid);
    if (Number.isNaN(teacherid)) {
      res.status(400).json({
        error: "invalid teacher id",
      });
    }
    if (isTeacher(token)) {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      page = Number.isNaN(page) || page < 0 ? 1 : page;
      limit = Number.isNaN(limit) || limit < 0 ? 15 : limit;
      const data = await PresenceService.getByteacherId(teacherid, limit, page);
      res.status(200).json(data);
    } else {
      res.status(403).json({
        msg: "Permisão recusada",
      });
    }
    return;
  },
};
export default PresenceController;
