"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VacationDiff;
function VacationDiff(vacation) {
    const month = Number(vacation?.split("/")[1]);
    const year = Number(vacation?.split("/")[2]);
    const day = Number(vacation?.split("/")[0]);
    if (month > 12 || month < 1) {
        return "Mês inválido";
    }
    if (day > 31 || day < 1) {
        return "Dia inválido";
    }
    if (year != new Date().getFullYear()) {
        return "Ano deve ser " + new Date().getFullYear();
    }
    const date = new Date();
    const actMonth = Number(date.getMonth() + 1);
    const diff = month - actMonth;
    console.log(diff);
    if (diff >= 1 && diff <= 2) {
        return "apto";
    }
    return "Erro de diferença mensal";
}
