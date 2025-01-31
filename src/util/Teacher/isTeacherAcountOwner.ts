import db from "../../database/dbConnection";
import type IUser from "../../models/User";
import { Decrypt } from "../password";

export default async function isTeacherAcountOwner(teacher: IUser) {
  const query =
    "SELECT id , email , password  FROM teacher WHERE id = $1 LIMIT 1;";
  return new Promise(async (resolve, reject) => {
    try {
      const { rowCount, rows } = await db.query(query, [teacher?.id]);
      if (rowCount == 0 || rowCount == null) {
        reject("not found");
        return;
      } else {
        if (teacher?.oldemail == rows[0]?.email) {
          const decrypedPassword = Decrypt(String(rows[0]?.password));
          if (decrypedPassword == teacher?.oldpassword) {
            resolve("owner");
            return;
          } else {
            resolve("password doesn´t matct");
            return;
          }
        } else {
          reject("email doesn´t match");
          return;
        }
      }
    } catch (error) {
      reject("error");
    }
  });
}
