import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

// Placeholder for menu pages that aren't designed in Stitch yet
export default function ComingSoon({ title, icon }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-space-xl gap-space-md">
      <div className="w-16 h-16 rounded-2xl bg-surface-container-low flex items-center justify-center text-primary">
        <Icon name={icon} className="text-[32px]" />
      </div>
      <h1 className="font-headline-lg text-headline-lg text-on-surface">{title}</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant">This page is coming soon.</p>
      <Link
        to="/"
        className="mt-space-sm px-space-md py-2 rounded-xl bg-primary text-on-primary hover:bg-primary-fixed font-label-caps text-label-caps uppercase transition-colors"
      >
        Back to counter
      </Link>
    </div>
  )
}
