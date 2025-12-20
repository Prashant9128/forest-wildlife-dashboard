import { Navigate } from "react-router-dom";

// Defines the logic for protecting admin routes
const AdminRoute = ({ children }) => {
    // Parse user from local storage safely
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : null;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
