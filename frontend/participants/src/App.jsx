import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Login from "./components/login/login";
import WizardIDE from "./components/login/console";
import Leaderboard from "./components/leaderboard";
import Rules from "./components/greathall";
import Hmap from "./components/Hufflepuff/Hmap";
import Gmap from "./components/Gryffindor/Gmap";
import Smap from "./components/Slytherin/Smap";
import Rmap from "./components/Ravenclaw/Rmap";
import DialoguePage from "./components/dialogue";

import ProtectedRoute from "./components/protectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/ide" element={
            <ProtectedRoute>
              <WizardIDE />
            </ProtectedRoute>
          } />
          <Route path="/hufflepuff/map" element={
            <ProtectedRoute>
              <Hmap />
            </ProtectedRoute>
          } />
          <Route path="/gryffindor/map" element={
            <ProtectedRoute>
              <Gmap />
            </ProtectedRoute>
          } />
          <Route path="/slytherin/map" element={
            <ProtectedRoute>
              <Smap />
            </ProtectedRoute>
          } />
          <Route path="/ravenclaw/map" element={
            <ProtectedRoute>
              <Rmap />
            </ProtectedRoute>
          } />
          <Route path="/ide/:housename/:questionNumber" element={
            <ProtectedRoute>
              <WizardIDE />
            </ProtectedRoute>
          } />
          <Route path="/ld" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
          <Route path="/rules" element={
            <ProtectedRoute>
              <Rules />
            </ProtectedRoute>
          } />
          <Route path="/dialogue/:house" element={
            <ProtectedRoute>
              <DialoguePage />
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
