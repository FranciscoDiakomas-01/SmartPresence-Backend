import type ICoord from "../models/Coord";
import CoordSerice from "../services/CoordService";
import { Request, Response } from "express";
import isValidCoord from "../util/Coord/isValid";
import { Encrypt } from "../util/password";
import isAdmin from "../util/Admin/isAdmin";
import isCoord from "../util/Coord/isCoord";
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
    }else{
      res.status(403).json({
        msg : "doesnt have permition"
      })
    }
    return;
  },

  delete: async function (req: Request, res: Response) {

    const token: string = req.body.token;
    if(isAdmin(token)){
      const id = Number(req.params.id);
      const data = await CoordSerice.delete(id);
      res.status(200).json({
        deleted: data,
      });
      return;
    }else{
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return
    }
    
  },

  getbyid: async function (req: Request, res: Response) {

    const token: string = req.body.token;
    if(isCoord(token) || isAdmin(token)){
        const id = Number(req.body.userid);
      const data = await CoordSerice.getbyid(id);
      res.status(200).json({
        data,
      });
      return;
    }else{
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return;
    }
  },

  create: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if(isAdmin(token)){ 
    const coord: ICoord = req.body;
    coord.password = Encrypt("Coord@01");
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
    }else{
      res.status(403).json({
            msg : "doesnt have permition"
      })
      return
    }
},

  update: async function (req: Request, res: Response) {
    const coord: ICoord = req.body;
    const isvalid = isValidCoord(coord);
    if (isvalid == "valid") {
      const data = await CoordSerice.update(coord);
      res.status(200).json({
        msg: data,
      });
      return;
    } else {
      res.status(400).json({
        error: isvalid,
      });
      return;
    }
  },

  toogle: async function (req: Request, res: Response) {
    const token: string = req.body.token;
    if(isAdmin(token)){
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
    }else{
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return;
    }
  },
};
export default CoordController;
