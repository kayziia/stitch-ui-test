import Icon from './Icon.jsx'

// The speaker button that turns click sounds on and off
export default function SoundButton({ soundOn, onToggle, className = '' }) {
  return (
    <button
      type="button"
      title="Audio Clicks"
      onClick={onToggle}
      className={`rounded-lg bg-surface-container hover:bg-surface-container-high flex items-center justify-center transition-all active:scale-95 ${soundOn ? 'text-primary' : 'text-outline'} ${className}`}
    >
      <Icon name={soundOn ? 'volume_up' : 'volume_off'} className="text-[18px]" />
    </button>
  )
}
