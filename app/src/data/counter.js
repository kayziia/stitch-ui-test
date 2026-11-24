// Starting values and sample data for the counter.
// Change them here and the whole app updates.

export const appName = 'Tally'

export const navLinks = [
  { label: 'Counter', to: '/' },
  { label: 'History', to: '/history' },
  { label: 'Metrics', to: '/metrics' },
  { label: 'Settings', to: '/settings' },
]

export const initialCounter = {
  title: 'Main Hall Attendees',
  count: 142,
  target: 250,
  step: 1,
  increments: 162,
  decrements: 22,
  sessionSeconds: 872, // 00:14:32
}

// The "stride" buttons, and the keys 1-5 that pick them
export const stepOptions = [1, 5, 10, 25, 100]

export const telemetry = {
  peakSpeed: 78,
  velocity: '+24 in last 5m',
  // Bar heights (percent) for the histogram. The highlighted bar is drawn in light blue.
  histogram: [
    { height: 30, opacity: 20 },
    { height: 45, opacity: 20 },
    { height: 20, opacity: 30 },
    { height: 60, opacity: 40 },
    { height: 40, opacity: 50 },
    { height: 85, opacity: 70 },
    { height: 65, opacity: 60 },
    { height: 95, highlight: true },
    { height: 50, opacity: 50 },
    { height: 75, opacity: 80 },
  ],
}

export const initialLog = [
  { id: 1, amount: 1, label: 'Increment registered', time: '10:42:15 AM' },
  { id: 2, amount: 5, label: 'Batch increment', time: '10:41:50 AM' },
  { id: 3, amount: -1, label: 'Manual correction', time: '10:40:02 AM' },
  { id: 4, amount: 0, badge: 'SET', label: 'Session checkpoint', time: '10:35:18 AM' },
]
