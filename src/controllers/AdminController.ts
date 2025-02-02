import type IAdmin from "../models/Admin";
import AdminService from "../services/AdminService";
import { Request, Response } from "express";
import isValidAdmin from "../util/Admin/isValid";
import type ILogin from "../types/ILogin";
import isValidLogin from "../util/Login/isValidLogin";
import GenerateToken from "../middlewares/token";
import isAdmin from "../util/Admin/isAdmin";
import type AdminVariables from "../types/AdminVariable";
import isValidAdminVariables from "../util/Admin/isValidVariables";
const AdminController = {
  update(req: Request, res: Response) {
    const Admin: IAdmin = req.body;
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const isvalid = isValidAdmin(Admin);
      if (isvalid == "valid") {
        AdminService.update(Admin);
        res.status(201).json({
          msg: "updated",
        });
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
  async get(req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const data = await AdminService.get();
      res.status(201).json(data);
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return;
    }
  },

  async dashBoard(req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const data = await AdminService.dahsBoard();
      res.status(201).json(data);
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return;
    }
  },
  async getAdminVariable(req: Request, res: Response) {
    const token: string = req.body.token;
    if (isAdmin(token)) {
      const data = AdminService.getAdminVariable();
      res.status(201).json(data);
    } else {
      res.status(403).json({
        msg: "doesnt have permition",
      });
      return;
    }
  },
  async updateAdminVariable(req: Request, res: Response) {
    const token: string = req.body.token;
    const admimVariables: AdminVariables = req.body;
    if (isAdmin(token)) {
      if (isValidAdminVariables(admimVariables) == "valid") {
        const data = AdminService.UpdateAdminVariable(
          admimVariables.coord,
          admimVariables.teacher
        );
        res.status(201).json({ data });
        return;
      } else {
        res.status(400).json({ smg: "invalid variables" });
        return;
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
      const response = await AdminService.login(login);
      if (isNaN(response)) {
        res.status(400).json({
          msg: "wrong credentials admin",
        });
        return;
      }
      const token = GenerateToken(response, "admin");
      res.status(200).json({
        token,
        msg: "wellcome admin",
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

export default AdminController