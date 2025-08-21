import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/login/login'
import Map from './components/dashboard/map'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Router>
  )
}

export default App