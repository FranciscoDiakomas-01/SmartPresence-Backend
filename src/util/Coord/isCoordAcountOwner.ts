import db from "../../database/dbConnection";
import type IUser from "../../models/User";
import { Decrypt } from "../password";

export default async function isCoorAcountOwner(coord: IUser) {
  const query =
    "SELECT id , email , password  FROM coord WHERE id = $1 LIMIT 1;";
  return new Promise(async (resolve, reject) => {
    try {
      const { rowCount, rows } = await db.query(query, [coord?.id]);
      if (rowCount == 0 || rowCount == null) {
        reject("Conta não encotrada");
        return;
      } else {
        if (coord?.oldemail == rows[0]?.email) {
          const decrypedPassword = Decrypt(String(rows[0]?.password));
          if (decrypedPassword == coord?.oldpassword) {
            resolve("owner");
            return;
          } else {
            reject("Palavras passe incorreta");
            return;
          }
        } else {
          reject("Email incorreto");
          return;
        }
      }
    } catch (error) {
      reject("error");
    }
  });
}
