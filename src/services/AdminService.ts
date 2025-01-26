import db from "../../src/database/dbConnection";
import type IAdmin from "../../src/models/Admin";
import type ILogin from "../types/ILogin";
import { Decrypt } from "../util/password";

class AdminServiceEmplemetation {

  #query : string = ""
  async update( Admin : IAdmin){
    this.#query = "UPDATE admin SET name = $1 , lastname = $2 , email = $3 , password = $4 , updated_at = now();"
    const { rowCount } = await db.query(this.#query , [Admin.name , Admin.lastname , Admin.email ,  Admin.password])
    return rowCount != 0 && rowCount != null
  }
  async get(){
    this.#query = "SELECT name  , lastname , email  FROM admin;"
    const { rows } = await db.query(this.#query)
    return rows 
  }

  async login(login : ILogin){
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
  
}

const AdminService = new AdminServiceEmplemetation()
export default AdminService
