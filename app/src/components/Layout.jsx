import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

// The frame around every page: header on top, footer at the bottom
export default function Layout() {
  const [soundOn, setSoundOn] = useState(true)
  const toggleSound = () => setSoundOn((on) => !on)

  return (
    <div className="bg-surface font-body-md text-body-md text-on-surface min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
      <Header soundOn={soundOn} onToggleSound={toggleSound} />
      <main className="w-full flex-1 pt-16 bg-surface flex flex-col justify-center max-w-7xl mx-auto px-margin-desktop">
        <Outlet context={{ soundOn, toggleSound }} />
      </main>
      <Footer />
    </div>
  )
}
