import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import NotFound from "./components/NotFound";

import ProtectedRoute from "./components/protectedRoute";
import HouseProtectedRoute from "./components/HouseProtectedRoute";
import "./App.css";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Generic protected routes */}
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

          {/* House-specific routes */}
          <Route path="/hufflepuff/map" element={
            <HouseProtectedRoute>
              <Hmap />
            </HouseProtectedRoute>
          } />
          <Route path="/gryffindor/map" element={
            <HouseProtectedRoute>
              <Gmap />
            </HouseProtectedRoute>
          } />
          <Route path="/slytherin/map" element={
            <HouseProtectedRoute>
              <Smap />
            </HouseProtectedRoute>
          } />
          <Route path="/ravenclaw/map" element={
            <HouseProtectedRoute>
              <Rmap />
            </HouseProtectedRoute>
          } />

          {/* IDE route with house protection */}
          <Route path="/ide/:housename/:questionNumber" element={
            <HouseProtectedRoute>
              <WizardIDE />
            </HouseProtectedRoute>
          } />

          <Route path="/dialogue/:house" element={
            <HouseProtectedRoute>
              <DialoguePage />
            </HouseProtectedRoute>
          } />

          {/* Generic IDE route without house param */}
          <Route path="/ide" element={
            <ProtectedRoute>
              <WizardIDE />
            </ProtectedRoute>
          } />

          {/* Catch-all 404 route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
