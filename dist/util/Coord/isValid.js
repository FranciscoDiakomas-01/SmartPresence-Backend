"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isValidCoord;
const validator_1 = __importDefault(require("validator"));
function isValidCoord(user) {
    try {
        if (!validator_1.default.isEmail(user.email)) {
            return "invalid email";
        }
        if (!validator_1.default.isStrongPassword(user.password)) {
            return "Palavra passe fraca";
        }
        else if (user?.name?.length < 3 || user?.name?.length > 14) {
            return "Nome inválido";
        }
        else if (user?.lastname?.length < 3 || user?.lastname?.length > 14) {
            return "Sobre nome Inválido";
        }
        else {
            return "valid";
        }
    }
    catch (error) {
        return "Dados inválido";
    }
}
