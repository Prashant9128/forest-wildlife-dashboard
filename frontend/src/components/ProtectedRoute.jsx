import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
    // We can use context, but falling back to localStorage is robust for refresh
    const { user } = useContext(AuthContext);

    // Also check localStorage directly to avoid flicker if context is initializing
    const localUser = localStorage.getItem("user");

    if (!user && !localUser) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
