import { useEffect, useRef, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Kbd from '../components/Kbd.jsx'
import LogItem from '../components/LogItem.jsx'
import SoundButton from '../components/SoundButton.jsx'
import { initialCounter, initialLog, stepOptions, telemetry } from '../data/counter.js'

// Short "click" sound made by the browser
let audioCtx = null
function playBeep(freq, duration = 0.04) {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime)
    gain.gain.setValueAtTime(0.08, audioCtx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start()
    osc.stop(audioCtx.currentTime + duration)
  } catch {
    // no sound available, ignore
  }
}

function formatTimer(total) {
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(Math.floor(total / 3600))}:${pad(Math.floor((total % 3600) / 60))}:${pad(total % 60)}`
}

const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })

export default function Counter() {
  const { soundOn, toggleSound } = useOutletContext()

  const [title, setTitle] = useState(initialCounter.title)
  const [count, setCount] = useState(initialCounter.count)
  const [target, setTarget] = useState(initialCounter.target)
  const [targetInput, setTargetInput] = useState(String(initialCounter.target))
  const [step, setStep] = useState(initialCounter.step)
  const [incs, setIncs] = useState(initialCounter.increments)
  const [decs, setDecs] = useState(initialCounter.decrements)
  const [history, setHistory] = useState([])
  const [log, setLog] = useState(initialLog)
  const [seconds, setSeconds] = useState(initialCounter.sessionSeconds)
  const [flash, setFlash] = useState(null) // 'up' | 'down' | null

  const titleRef = useRef(null)
  const nextId = useRef(100)

  // Session timer ticks every second
  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  const beep = (freq, duration) => soundOn && playBeep(freq, duration)

  const pulse = (direction) => {
    setFlash(direction)
    setTimeout(() => setFlash(null), 120)
  }

  const addLog = (amount, label, badge) => {
    const entry = { id: nextId.current++, amount, label, badge, time: nowTime() }
    setLog((items) => [entry, ...items].slice(0, 12))
  }

  const changeBy = (amount) => {
    setHistory((h) => [...h, count])
    setCount(count + amount)
    if (amount > 0) setIncs((n) => n + 1)
    else setDecs((n) => n + 1)
    beep(amount > 0 ? 720 : 480)
    pulse(amount > 0 ? 'up' : 'down')
    addLog(amount, amount > 0 ? (amount > 1 ? 'Batch increment' : 'Increment') : 'Decrement')
  }

  const undo = () => {
    if (history.length === 0) return
    const prev = history[history.length - 1]
    const delta = prev - count
    setHistory((h) => h.slice(0, -1))
    setCount(prev)
    beep(520, 0.06)
    pulse(delta > 0 ? 'up' : 'down')
    addLog(delta, 'Action undone')
  }

  const reset = () => {
    if (!window.confirm('Reset tally count to 0?')) return
    setHistory((h) => [...h, count])
    setCount(0)
    beep(320, 0.1)
    pulse('down')
    addLog(0, 'Reset to zero', 'SET')
  }

  const updateTarget = () => {
    const val = parseInt(targetInput, 10)
    if (!isNaN(val) && val > 0) {
      setTarget(val)
      addLog(0, `Target set to ${val}`, 'SET')
    }
  }

  // Keyboard shortcuts. A ref keeps the latest functions so the listener never goes stale.
  const actions = useRef({})
  actions.current = { changeBy, undo, reset, step }
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT') return
      const a = actions.current
      if (e.code === 'Space' || e.key === 'ArrowUp') {
        e.preventDefault()
        a.changeBy(a.step)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        a.changeBy(-a.step)
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault()
        a.reset()
      } else if (e.key === 'z' || e.key === 'Z') {
        e.preventDefault()
        a.undo()
      } else if (['1', '2', '3', '4', '5'].includes(e.key)) {
        setStep(stepOptions[Number(e.key) - 1])
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const pct = Math.min(100, Math.max(0, Math.round((count / target) * 100)))

  return (
    <div className="flex flex-col w-full py-space-lg select-none">
      {/* Top bar: session timer, counter name, quick buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md mb-space-xl">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center gap-space-xs px-space-md py-1.5 rounded-full bg-surface-container text-on-surface">
            <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span className="font-label-caps text-label-caps uppercase text-outline">SESSION ACTIVE</span>
            <span className="text-outline">/</span>
            <span className="font-label-numeric text-label-numeric text-tertiary">{formatTimer(seconds)}</span>
          </div>
          <div className="flex items-center gap-space-xs group bg-surface-container-low px-space-md py-1 rounded-xl">
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-transparent border-0 font-body-lg text-body-lg text-on-surface font-medium focus:outline-none focus:ring-0 w-48 text-left select-text selection:bg-primary-container"
            />
            <button type="button" onClick={() => titleRef.current?.focus()} title="Rename">
              <Icon name="edit" className="text-[16px] text-outline group-hover:text-primary transition-colors cursor-pointer" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            type="button"
            onClick={undo}
            title="Undo last step (Z)"
            className="flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-all active:scale-95"
          >
            <Icon name="undo" className="text-[18px]" />
            <span className="font-label-caps text-label-caps uppercase">Undo</span>
          </button>
          <SoundButton soundOn={soundOn} onToggle={toggleSound} className="w-9 h-9 rounded-xl" />
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-space-xs px-space-md py-2 rounded-xl bg-error-container/40 hover:bg-error-container text-on-error-container transition-all active:scale-95"
          >
            <Icon name="restart_alt" className="text-[18px]" />
            <span className="font-label-caps text-label-caps uppercase tracking-wider">Reset</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
        {/* Left: the big counter */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full relative rounded-3xl bg-surface-container-low p-space-xl flex flex-col items-center justify-center overflow-hidden shadow-2xl">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary-container/15 rounded-full blur-3xl pointer-events-none"></div>

            {/* Goal progress bar */}
            <div className="w-full max-w-md flex flex-col gap-1.5 mb-space-lg">
              <div className="flex justify-between items-center text-on-surface-variant">
                <span className="font-label-caps text-label-caps uppercase text-outline">Target Goal Progress</span>
                <span className="font-label-numeric text-label-numeric text-primary">
                  {count.toLocaleString()} / {target.toLocaleString()} ({pct}%)
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary-container via-primary to-tertiary transition-all duration-300 rounded-full"
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
            </div>

            {/* The number */}
            <div className="relative py-space-sm flex items-center justify-center w-full">
              <div
                className={`absolute inset-0 bg-primary/10 rounded-2xl pointer-events-none transition-opacity duration-150 ${flash ? 'opacity-70' : 'opacity-0'}`}
              ></div>
              <span
                className="font-label-numeric text-[72px] sm:text-[118px] leading-none tracking-tight font-bold text-on-surface tabular-nums drop-shadow-[0_4px_30px_rgba(0,0,0,0.4)] transition-transform duration-100"
                style={{ transform: flash === 'up' ? 'scale(1.04)' : flash === 'down' ? 'scale(0.96)' : 'scale(1)' }}
              >
                {count.toLocaleString()}
              </span>
            </div>

            {/* Speed + current step */}
            <div className="mt-space-xs mb-space-lg flex items-center gap-space-sm">
              <div className="px-space-md py-0.5 rounded-full bg-surface-container-high flex items-center gap-1">
                <Icon name="trending_up" className="text-[14px] text-tertiary" />
                <span className="font-label-numeric text-label-numeric text-tertiary">{telemetry.velocity}</span>
              </div>
              <span className="text-outline-variant font-label-numeric text-label-numeric">·</span>
              <span className="font-label-caps text-label-caps uppercase text-outline">Step:</span>
              <span className="font-label-numeric text-label-numeric text-on-surface px-1.5 py-0.5 rounded bg-surface-container">+{step}</span>
            </div>

            {/* Minus and plus buttons */}
            <div className="w-full grid grid-cols-5 gap-space-md mt-space-sm">
              <button
                type="button"
                onClick={() => changeBy(-step)}
                className="col-span-2 group relative h-24 rounded-2xl bg-surface-container hover:bg-surface-container-high active:bg-surface-bright flex flex-col items-center justify-center text-on-surface transition-all active:scale-[0.98] shadow-md"
              >
                <Icon name="remove" className="text-[36px] text-on-surface-variant group-hover:text-error transition-colors" />
                <span className="font-label-caps text-label-caps uppercase text-outline group-hover:text-on-surface-variant mt-1">Decrement (-{step})</span>
              </button>
              <button
                type="button"
                onClick={() => changeBy(step)}
                className="col-span-3 group relative h-24 rounded-2xl bg-primary text-on-primary hover:bg-primary-fixed hover:text-on-primary-fixed active:scale-[0.98] flex flex-col items-center justify-center transition-all shadow-[0_8px_32px_rgba(192,193,255,0.2)]"
              >
                <Icon name="add" className="text-[42px] font-bold" />
                <span className="font-label-caps text-label-caps uppercase tracking-wider opacity-85 mt-0.5">Increment (+{step})</span>
              </button>
            </div>

            {/* Step size chips */}
            <div className="w-full flex flex-wrap items-center justify-between gap-space-sm pt-space-lg mt-space-md">
              <span className="font-label-caps text-label-caps uppercase text-outline">Stride Scale</span>
              <div className="flex items-center gap-space-xs">
                {stepOptions.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setStep(value)}
                    className={`px-space-md py-1.5 rounded-full font-label-numeric text-label-numeric transition-all ${
                      step === value
                        ? 'bg-primary text-on-primary font-semibold'
                        : 'bg-surface-container text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Goal setting */}
          <div className="w-full mt-space-md p-space-md rounded-2xl bg-surface-container-low flex flex-wrap items-center justify-between gap-space-md">
            <div className="flex items-center gap-space-sm">
              <Icon name="flag" className="text-[20px] text-tertiary" />
              <div className="flex flex-col">
                <span className="font-label-caps text-label-caps uppercase text-outline">Target Goal</span>
                <span className="font-body-md text-body-md text-on-surface">Auto-alert on milestone</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs">
              <span className="font-label-caps text-label-caps text-outline uppercase mr-1">Goal Limit:</span>
              <input
                type="number"
                value={targetInput}
                onChange={(e) => setTargetInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && updateTarget()}
                className="w-24 px-space-sm py-1 rounded-lg bg-surface-container-lowest text-on-surface font-label-numeric text-label-numeric text-right focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="button"
                onClick={updateTarget}
                className="px-space-md py-1 rounded-lg bg-surface-container-high hover:bg-primary hover:text-on-primary text-on-surface transition-colors font-label-caps text-label-caps uppercase"
              >
                Update
              </button>
            </div>
          </div>
        </div>

        {/* Right: stats and activity */}
        <div className="lg:col-span-5 flex flex-col gap-space-md">
          <div className="w-full rounded-2xl bg-surface-container-low p-space-lg flex flex-col gap-space-md shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-xs">
                <Icon name="monitoring" className="text-[20px] text-primary" />
                <span className="font-headline-md text-headline-md text-on-surface">Telemetry</span>
              </div>
              <span className="font-label-caps text-label-caps uppercase text-outline">Real-Time</span>
            </div>
            <div className="grid grid-cols-2 gap-space-sm">
              <div className="bg-surface-container p-space-md rounded-xl flex flex-col">
                <span className="font-label-caps text-label-caps uppercase text-outline">Peak Click Speed</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-label-numeric text-[22px] leading-tight font-bold text-on-surface">{telemetry.peakSpeed}</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">RPM</span>
                </div>
                <span className="text-tertiary font-label-caps text-[10px] mt-1">Rolling 60s window</span>
              </div>
              <div className="bg-surface-container p-space-md rounded-xl flex flex-col">
                <span className="font-label-caps text-label-caps uppercase text-outline">Total Operations</span>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="font-label-numeric text-[22px] leading-tight font-bold text-on-surface">{incs + decs}</span>
                  <span className="font-label-caps text-label-caps text-on-surface-variant">clicks</span>
                </div>
                <span className="text-outline font-label-caps text-[10px] mt-1">
                  {incs} inc / {decs} dec
                </span>
              </div>
            </div>
            <div className="w-full bg-surface-container p-space-md rounded-xl flex flex-col gap-2">
              <div className="flex justify-between items-center text-outline">
                <span className="font-label-caps text-label-caps uppercase">Impulse Density Histogram</span>
                <span className="font-label-numeric text-label-numeric">15 min</span>
              </div>
              <div className="h-16 w-full flex items-end justify-between gap-1 pt-2">
                {telemetry.histogram.map((bar, i) => (
                  <div
                    key={i}
                    className={`w-full rounded-t ${bar.highlight ? 'bg-tertiary' : 'bg-primary'}`}
                    style={{ height: `${bar.height}%`, opacity: bar.highlight ? 1 : bar.opacity / 100 }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full rounded-2xl bg-surface-container-low p-space-lg flex flex-col shadow-lg">
            <div className="flex items-center justify-between mb-space-md">
              <div className="flex items-center gap-space-xs">
                <Icon name="history" className="text-[18px] text-on-surface-variant" />
                <span className="font-headline-md text-headline-md text-on-surface">Ledger Activity</span>
              </div>
              <button
                type="button"
                onClick={() => setLog([])}
                className="font-label-caps text-label-caps uppercase text-outline hover:text-on-surface transition-colors"
              >
                Clear
              </button>
            </div>
            <div className="flex flex-col gap-space-xs max-h-56 overflow-y-auto pr-1">
              {log.length === 0 ? (
                <div className="py-4 text-center font-label-caps text-label-caps uppercase text-outline">Ledger reset</div>
              ) : (
                log.map((entry) => <LogItem key={entry.id} entry={entry} />)
              )}
            </div>
          </div>

          <div className="w-full rounded-2xl bg-surface-container-lowest p-space-md flex items-center justify-between text-on-surface-variant">
            <div className="flex items-center gap-space-xs font-label-numeric text-label-numeric">
              <Kbd>Space</Kbd>
              <span className="text-outline">Step</span>
              <span className="text-outline">/</span>
              <Kbd>Z</Kbd>
              <span className="text-outline">Undo</span>
              <span className="text-outline">/</span>
              <Kbd>1-5</Kbd>
              <span className="text-outline">Stride</span>
            </div>
            <div className="flex items-center gap-1 text-tertiary">
              <Icon name="bolt" className="text-[16px]" />
              <span className="font-label-caps text-label-caps uppercase">Ready</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
