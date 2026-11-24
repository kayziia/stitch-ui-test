import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Counter from './pages/Counter.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Counter />} />
          <Route path="/history" element={<ComingSoon title="History" icon="history" />} />
          <Route path="/metrics" element={<ComingSoon title="Metrics" icon="monitoring" />} />
          <Route path="/settings" element={<ComingSoon title="Settings" icon="settings" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
