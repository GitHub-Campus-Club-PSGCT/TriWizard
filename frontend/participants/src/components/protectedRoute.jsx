import React from "react";
import { Navigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({children}) {
  const { isLoggedIn, loading } = useAuth();
  console.log("🛡️ ProtectedRoute - isLoggedIn:", isLoggedIn, "loading:", loading);
  
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    console.log("🚫 Not authenticated, redirecting to login");
    return <Navigate to="/login"/>;
  }

  console.log("✅ Authenticated, rendering protected content");
  return children;
}

export default ProtectedRoute;
