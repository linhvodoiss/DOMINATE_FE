export function formatDateTimeVN(input?: string): string {
  if (!input) return '--'
  const [date, time] = input.split(' ')
  const [year, month, day] = date?.split('-') || []
  if (!year || !month || !day || !time) return '--'
  return `${time} - ${day}/${month}/${year}`
}
