import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("jwt"); // Παίρνουμε το token από το localStorage

    return token ? <Outlet /> : <Navigate to="/" replace />; 
};

export default ProtectedRoute;
