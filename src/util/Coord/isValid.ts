import validator from "validator";
import IUser from "../../models/User";
export default function isValidCoord(user: IUser) {
  try {
    if (!validator.isEmail(user.email)) {
      return "invalid email";
    }
    if (!validator.isStrongPassword(user.password)) {
      return "invalid passsword";
    } else if (user?.name?.length < 3 || user?.name?.length > 14) {
      return "invalid name";
    } else if (user?.lastname?.length < 3 || user?.lastname?.length > 14) {
      return "invalid lastname";
    } else {
      return "valid";
    }
  } catch (error) {
    return "invalid user";
  }
}
