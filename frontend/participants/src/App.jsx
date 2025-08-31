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
          <Route element={<ProtectedRoute />}>
            <Route path="/ide" element={<WizardIDE />} />
            <Route path="/hufflepuff/map" element={<Hmap />} />
            <Route path="/gryffindor/map" element={<Gmap />} />
            <Route path="/slytherin/map" element={<Smap />} />
            <Route path="/ravenclaw/map" element={<Rmap />} />
            <Route path="/ide/:housename/:questionNumber" element={<WizardIDE />} />
            <Route path="/ld" element={<Leaderboard />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/dialogue" element={<DialoguePage house="Hufflepuff" nextRoute="/slytherin/map" />}/>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
