import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/login/login'
import './App.css'
import WizardIDE from './components/login/console'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/ide" element={<WizardIDE />} />
      </Routes>
    </Router>
  )
}

export default App