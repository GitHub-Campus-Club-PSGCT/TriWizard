import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

import Login from './components/login/login';
import WizardIDE from './components/login/console';
import Hmap from './components/Hufflepuff/Hmap';
import Gmap from './components/Gryffindor/Gmap';
import Smap from './components/Slytherin/Smap';
import Rmap from './components/Ravenclaw/Rmap';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/ide" element={<WizardIDE />} />
          <Route path="/hufflepuff/map" element={<Hmap />} />
          <Route path="/gryffindor/map" element={<Gmap />} />
          <Route path="/slytherin/map" element={<Smap />} />
          <Route path="/ravenclaw/map" element={<Rmap />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;