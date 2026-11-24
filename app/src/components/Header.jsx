import { NavLink } from 'react-router-dom'
import Icon from './Icon.jsx'
import SoundButton from './SoundButton.jsx'
import { appName, navLinks } from '../data/counter.js'

export default function Header({ soundOn, onToggleSound }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-margin-desktop flex items-center justify-between">
        <div className="flex items-center gap-space-lg">
          <NavLink to="/" className="flex items-center gap-space-sm">
            <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <Icon name="pin" className="text-[18px]" />
            </div>
            <span className="font-headline-md text-headline-md tracking-tight text-on-surface">{appName}</span>
            <span className="font-label-caps text-label-caps uppercase px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant">PRO</span>
          </NavLink>
          <nav className="hidden md:flex items-center gap-space-xs">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  `px-space-md py-space-xs rounded-lg font-body-md text-body-md transition-colors ${
                    isActive ? 'text-on-surface bg-surface-container-high' : 'text-on-surface-variant hover:text-on-surface'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-space-md">
          <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container-low text-on-surface-variant">
            <span className="font-label-caps text-label-caps uppercase text-outline">Hotkeys</span>
            <kbd className="font-label-numeric text-label-numeric px-1 rounded bg-surface-container text-on-surface">?</kbd>
          </div>
          <SoundButton soundOn={soundOn} onToggle={onToggleSound} className="w-8 h-8" />
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Icon name="person" className="text-on-primary text-[18px]" />
          </div>
        </div>
      </div>
    </header>
  )
}
