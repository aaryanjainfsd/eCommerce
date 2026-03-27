import { Navigate } from "react-router-dom";
import useAdminAuthStore from "../../../adminPanel/stores/adminAuthStore";

// Protects admin routes: if the admin is not logged in, redirect to /admin (login).
export default function AdminProtectedRoute({ children }) {
    const { isLoggedIn } = useAdminAuthStore();

    if (!isLoggedIn) {
        return <Navigate to="/adminPanel" replace />;
    }

    return children;
}
