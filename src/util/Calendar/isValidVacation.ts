
export default function VacationDiff(vacation : string) {

  const month = Number(vacation?.split("/")[1]);
  const date = new Date();
  const actMonth = Number((date.getMonth() + 1))
  const diff = month - actMonth
  return diff >= 1 &&  diff <= 3

}
