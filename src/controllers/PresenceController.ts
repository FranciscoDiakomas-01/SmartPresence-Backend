import isValidPresence from "../util/Presence/isValid";
import { Request, Response } from "express";
import isAdmin from "../util/Admin/isAdmin";
import type IPresence from "../models/Presence";
import PresenceService from "../services/PresnceService";
import { extractIdInTokem } from "../middlewares/token";
import hasOcupation from "../util/Presence/hasOcupation";

const PresenceController = {
  create: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const presence: IPresence = req.body;
      const ivalid = await isValidPresence(presence);
      if (ivalid == "valid") {
        const id = extractIdInTokem(presence.token_teacher) as { id : number}
        presence.teacher_id = id.id
        const isFree = await hasOcupation(presence.teacher_id , presence.today )
        if(!isFree){
          res.status(403).json({
            error : "No calendar found"
          })
          return ; 
        }
        await PresenceService.create(presence);
        res.status(201).json({
          data: "wellcome teacher",
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
        msg: "doesnt have permition",
      });
      return;
    }
  },

  update: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    const presence_id = Number(req.params.id); 
    const teachertoken :  string = req.body.token
    if (!teachertoken || Number.isNaN(presence_id)) {
      res.status(400).json({
        error: "no presence id and no teacherid",
      });
      return;
    }
    if (isAdmin(token)) {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      page = Number.isNaN(page) ? 1 : page;
      limit = Number.isNaN(limit) ? 20 : limit;
      const data = await PresenceService.getLatest(limit, page);
      res.status(200).json(data);
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
    }
    return;
  },
  get: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      let page = Number(req.query.page);
      let limit = Number(req.query.limit);
      page = Number.isNaN(page) ? 1 : page;
      limit = Number.isNaN(limit) ? 20 : limit;
      const data = await PresenceService.getLatest(limit, page);
      res.status(200).json(data);
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
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
      page = Number.isNaN(page) ? 1 : page;
      limit = Number.isNaN(limit) ? 20 : limit;
      const data = await PresenceService.getByteacherId(teacherid, limit, page);
      res.status(200).json(data);
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
    }
    return;
  },
};
export default PresenceController;
