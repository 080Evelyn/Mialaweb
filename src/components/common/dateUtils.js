// utils/dateUtils.js
function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function isWithinDays(date, days) {
  const now = new Date();
  const target = new Date(date);
  const diffTime = now - target;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= days;
}

export function matchDateFilter(dateArray, filterValue) {
  const [year, month, day] = dateArray;
  const target = new Date(year, month - 1, day);

  const today = new Date();

  switch (filterValue) {
    case "today":
      return isSameDay(target, today);
    case "yesterday":
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      return isSameDay(target, yesterday);
    case "last7":
      return isWithinDays(target, 7);
    case "last30":
      return isWithinDays(target, 30);
    case "thisWeek": {
      const firstDayOfWeek = new Date();
      firstDayOfWeek.setDate(today.getDate() - today.getDay());
      return target >= firstDayOfWeek && target <= today;
    }
    case "thisMonth":
      return (
        target.getFullYear() === today.getFullYear() &&
        target.getMonth() === today.getMonth()
      );
    case "all":
    case "":
    default:
      return true;
  }
}
