// AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!sessionStorage.getItem("accessToken"));

    // sessionStorage에 변화가 있을 때마다 상태를 업데이트
    useEffect(() => {
        const handleStorageChange = () => {
            setIsLoggedIn(!!sessionStorage.getItem("accessToken"));
        };

        window.addEventListener("storage", handleStorageChange);

        // cleanup
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};
