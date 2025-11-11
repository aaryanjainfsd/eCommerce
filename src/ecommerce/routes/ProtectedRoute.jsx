import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider";

function ProtectedRoute({ children }) {
    const { loggedInStatus } = useAuth();

    console.log("isLoggedIn", loggedInStatus); // Logging as false, even after logging in

    if (loggedInStatus === null) {
        return <div>Loading...</div>;
    }

    if (!loggedInStatus) {
        return <Navigate to="/login" />;
    }

    return children;
}

export default ProtectedRoute;
