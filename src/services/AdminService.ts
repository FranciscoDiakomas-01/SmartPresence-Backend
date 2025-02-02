import db from "../database/dbConnection";
import type IAdmin from "../../src/models/Admin";
import type ILogin from "../types/ILogin";
import { Decrypt } from "../util/password";
import path from 'node:path'
import fs from 'node:fs'

class AdminServiceEmplemetation {

  #query : string = ""
  public async update( Admin : IAdmin){
    this.#query = "UPDATE admin SET name = $1 , lastname = $2 , email = $3 , password = $4 , updated_at = now();"
    const { rowCount } = await db.query(this.#query , [Admin.name , Admin.lastname , Admin.email ,  Admin.password])
    return rowCount != 0 && rowCount != null
  }
  public async get(){
    this.#query = "SELECT name  , lastname , email  FROM admin;"
    const { rows } = await db.query(this.#query)
    return rows[0] 
  }

  public async login(login : ILogin){
    this.#query = "SELECT id , password  FROM admin WHERE email = $1;"
    const { rows, rowCount } = await db.query(this.#query , [login.email])
    if(rowCount == 0){
      return "not found"
    }
    const id = rows[0]?.id
    const password = Decrypt(String(rows[0]?.password));
    if(password == login.password){
      return id
    }else{
      return "incorret credentials" 
    }
    
  }
  public async dahsBoard(){
    this.#query = "SELECT count(*)  as total FROM coord;"
    const { rows : total_coord} = await db.query(this.#query)
    this.#query = "SELECT count(*) as total FROM teacher;";
    const { rows : total_teacher } = await db.query(this.#query);
    return { total_teacher: total_teacher[0].total, total_coord: total_coord[0].total };
  }
  public  getAdminVariable(){
    try {
      const coordVariable = fs.readFileSync(path.join(process.cwd() + '/config/coord.txt'), { encoding : 'utf8'})
      const teacherVariable = fs.readFileSync(path.join(process.cwd() + '/config/teacher.txt') , { encoding : 'utf8'})
      return { coordVariable , teacherVariable}
    } catch (error) {
      return "Admin files config doesn´t found"
    }
    
  }

  public  UpdateAdminVariable(coord : string , teacher : string){
    try {
      fs.writeFileSync(path.join(process.cwd() + '/config/coord.txt') , coord , { encoding : 'utf8'})
      fs.writeFileSync(path.join(process.cwd() + '/config/teacher.txt') , teacher , { encoding : 'utf8'})
      return "updated"
    } catch (error) {
      return "Admin files config doesn´t found";
    }
    
  }
  
}

const AdminService = new AdminServiceEmplemetation()
export default AdminService
