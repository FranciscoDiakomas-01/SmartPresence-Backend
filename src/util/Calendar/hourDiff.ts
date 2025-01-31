

export default function HourDiff( hour_start : string , hour_end: string){
  const hour1 = Number(hour_start?.split(":")[0])
  const hour2 = Number(hour_end?.split(":")[0]);
  const diff = hour2 - hour1
  return diff
}