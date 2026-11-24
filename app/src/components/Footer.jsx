import Kbd from './Kbd.jsx'

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest/60 backdrop-blur-md py-space-md mt-auto shadow-[0_-1px_8px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-margin-desktop flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex flex-wrap items-center gap-space-lg text-on-surface-variant font-label-numeric text-label-numeric">
          <div className="flex items-center gap-space-xs">
            <Kbd>Space</Kbd>
            <span className="text-outline">or</span>
            <Kbd>↑</Kbd>
            <span className="font-body-md text-body-md text-on-surface-variant">Count Up</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <Kbd>↓</Kbd>
            <span className="font-body-md text-body-md text-on-surface-variant">Count Down</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <Kbd>R</Kbd>
            <span className="font-body-md text-body-md text-on-surface-variant">Reset</span>
          </div>
        </div>
        <div className="flex items-center gap-space-md">
          <span className="font-label-caps text-label-caps uppercase tracking-wider text-outline">Hardware Latency 0.4ms</span>
          <div className="w-1.5 h-1.5 rounded-full bg-tertiary"></div>
        </div>
      </div>
    </footer>
  )
}
