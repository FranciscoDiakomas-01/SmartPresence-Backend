import { Request, Response } from "express";
import CalendarService from "../services/Canlendar";
import isAdmin from "../util/Admin/isAdmin";
import isCoord from "../util/Coord/isCoord";
import ICalendar from "../models/Calenadar";
import isValiCalendar from "../util/Calendar/isValid";
import isTeacher from "../util/Teacher/isTeacher";
import { extractIdInTokem } from "../middlewares/token";
const CalendarController = {
  delete: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const id = Number(req.params.id);
      const data = await CalendarService.delete(id);
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

  get: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const teacher_id = Number(req.params.id);
      const data = await CalendarService.get(teacher_id);
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
  getbytoken: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isTeacher(token)) {
      const id = Number(req.body.userid)
      const data = await CalendarService.get(id);
      res.status(200).json(data);
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
    const teacher_id = Number(req.params.id);
    if (isAdmin(token)) {
      const calendar: ICalendar = req.body;
      calendar.teacher_id = teacher_id;
      const isvalid = await isValiCalendar(calendar);
      if (isvalid == "valid") {
        const data = await CalendarService.create(calendar);
        res.status(201).json({ data });
        return;
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
};
export default CalendarController;
