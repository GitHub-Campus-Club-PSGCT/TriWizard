import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './components/login/login';
import WizardIDE from './components/login/console';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/ide" element={<WizardIDE />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;