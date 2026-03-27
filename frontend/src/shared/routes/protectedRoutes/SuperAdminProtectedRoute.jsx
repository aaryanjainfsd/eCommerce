import { Navigate } from "react-router-dom";    
import useSuperAdminAuthStore from "../../../superAdminPanel/stores/SuperAdminAuthStore";

// Protects super admin routes: if the super admin is not logged in, redirect to /superAdminPanel (login).
export default function SuperAdminProtectedRoute({ children }) 
{
    const { isLoggedIn } = useSuperAdminAuthStore();
    
    if (!isLoggedIn) {
        return <Navigate to="/superAdminPanel" replace />;
    }

    return children;
}