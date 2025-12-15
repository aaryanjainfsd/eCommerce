import { createContext, useContext, useEffect, useState } from "react";
import instance from "../../shared/config/axiosConfig";
import { Navigate } from "react-router-dom";

const authContext = createContext();

function AuthProvider({ children }) {
    const [loggedInStatus, setLoggedInStatus] = useState(false);
    const [userData, setUserData] = useState([]);

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setUserData(JSON.parse(storedUser));
        }
        checkUserLoggedIn();
    },[]);

    async function checkUserLoggedIn() {
        try 
        {
            const response = await instance.get("/auth/authCheck", { withCredentials: true });
            setLoggedInStatus(true);
        } 
        catch (error) 
        {
            setLoggedInStatus(false);
        }
    }

    async function logout() {
        try {
            await instance.post( "/auth/logout", {}, { withCredentials: true, } );
            localStorage.removeItem("userData");
            setLoggedInStatus(false);
            <Navigate to="/login" />;
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <authContext.Provider value={{ userData, setUserData, loggedInStatus, checkUserLoggedIn, logout }}>
            {children}
        </authContext.Provider>
    );
}

export function useAuth() {
    return useContext(authContext);
}

export default AuthProvider;
