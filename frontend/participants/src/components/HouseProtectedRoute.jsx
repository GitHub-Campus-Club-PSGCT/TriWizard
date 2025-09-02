import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function HouseProtectedRoute({ children }) {
    const { user, isLoggedIn, loading } = useAuth();
    const { housename } = useParams();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        console.log("🚫 Not authenticated, redirecting to login");
        return <Navigate to="/login" />;
    }

    // Check if user's house matches the route's house
    // Convert both to lowercase for case-insensitive comparison
    const userHouse = user?.houseName?.toLowerCase();
    const routeHouse = housename?.toLowerCase();

    if (routeHouse && userHouse !== routeHouse) {
        console.log(`🚫 User is from ${userHouse}, cannot access ${routeHouse} house content`);
        // Redirect to their own house's map
        return <Navigate to={`/${userHouse}/map`} />;
    }

    console.log("✅ Authenticated and authorized for house, rendering protected content");
    return children;
}

export default HouseProtectedRoute;