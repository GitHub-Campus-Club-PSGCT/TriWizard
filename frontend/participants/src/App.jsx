import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './components/login/login';
import WizardIDE from './components/login/console';
import Leaderboard from './components/leaderboard';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/ide/:housename/:questionNumber" element={<WizardIDE />} />
          <Route path="/ld" element={<Leaderboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;