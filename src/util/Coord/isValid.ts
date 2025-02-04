import validator from "validator";
import IUser from "../../models/User";
export default function isValidCoord(user: IUser) {
  try {
    if (!validator.isEmail(user.email)) {
      return "invalid email";
    }
    if (!validator.isStrongPassword(user.password)) {
      return "Palavra passe fraca";
    } else if (user?.name?.length < 3 || user?.name?.length > 14) {
      return "Nome inválido";
    } else if (user?.lastname?.length < 3 || user?.lastname?.length > 14) {
      return "Sobre nome Inválido";
    } else {
      return "valid";
    }
  } catch (error) {
    return "Dados inválido";
  }
}
