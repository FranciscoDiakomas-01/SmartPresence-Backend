"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HourDiff;
function HourDiff(hour_start, hour_end) {
    const hour1 = Number(hour_start?.split(":")[0]);
    const hour2 = Number(hour_end?.split(":")[0]);
    const diff = hour2 - hour1;
    return diff;
}
