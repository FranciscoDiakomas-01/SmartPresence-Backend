import validator from 'validator'
import type ICoord from '../../models/Coord';

export default function isValidCoord(coord : ICoord){

  try {
    if(!validator.isEmail(coord.email)){
      return "invalid email"
    }if (!validator.isStrongPassword(coord.password)) {
      return "invalid passsword";
    } else if (coord?.name?.length < 3 || coord?.name?.length > 14) {
      return "invalid name";
    } else if (coord?.lastname?.length < 3 || coord?.lastname?.length > 14) {
      return "invalid lastname";
    } else {
      return "valid";
    }
  } catch (error) {
      return "invalid coord"
  }

}