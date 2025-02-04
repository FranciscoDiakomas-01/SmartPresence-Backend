import db from "../../database/dbConnection";
import { Decrypt } from "../password";
import type IAdmin from "../../models/Admin";
export default async function isAdminAcountOwner(admin: IAdmin) {
  const query = "SELECT id , email , password  FROM admin LIMIT 1;";
  
  return new Promise(async (resolve, reject) => {

    try {
      const { rowCount, rows } = await db.query(query);
      if (rowCount == 0 || rowCount == null) {
        reject("Conta não encotrada");
        return;
      } else {
        if (admin?.oldemail == rows[0]?.email) {
          const decrypedPassword = Decrypt(String(rows[0]?.password));
          if (decrypedPassword == admin?.oldpassword) {
            resolve("owner");
            return;
          } else {
            reject("Palavras passe não batem");
            return;
          }
        } else {
          reject("Email não batem");
          return;
        }
      }
    } catch (error) {
      reject("error");
    }
  });
}
