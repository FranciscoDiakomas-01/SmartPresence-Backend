import validator from 'validator'
import AdminVariables from '../../types/AdminVariable';

export default function isValidAdminVariables(Admin : AdminVariables){

  try {
    return validator.isStrongPassword(Admin.coord) && validator.isStrongPassword(Admin.teacher) ? "valid" : "invalid"
  } catch (error) {
    return "invalid"
  }
}