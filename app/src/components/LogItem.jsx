// One row in the "Ledger Activity" list
export default function LogItem({ entry }) {
  let badgeStyle = 'bg-primary-container text-on-primary-container'
  if (entry.amount < 0) badgeStyle = 'bg-error-container text-on-error-container'
  else if (entry.amount === 0) badgeStyle = 'bg-secondary-container text-on-secondary-container'

  const badge = entry.badge ?? (entry.amount > 0 ? `+${entry.amount}` : entry.amount === 0 ? '0' : `${entry.amount}`)

  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-surface-container text-on-surface">
      <div className="flex items-center gap-2">
        <span className={`min-w-5 px-0.5 h-5 rounded flex items-center justify-center font-label-numeric text-[11px] font-bold ${badgeStyle}`}>
          {badge}
        </span>
        <span className="font-body-md text-body-md">{entry.label}</span>
      </div>
      <span className="font-label-numeric text-label-numeric text-outline">{entry.time}</span>
    </div>
  )
}
