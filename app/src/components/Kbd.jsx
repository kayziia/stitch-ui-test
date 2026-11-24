// A small keyboard key label, like [Space]
export default function Kbd({ children, className = '' }) {
  return (
    <kbd className={`px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface font-label-numeric text-label-numeric ${className}`}>
      {children}
    </kbd>
  )
}
