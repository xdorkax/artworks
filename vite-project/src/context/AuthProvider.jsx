import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import app from '../firebase';

export const AuthContext = React.createContext();

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const auth = getAuth(app);
        onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });
    }, []);

    const logout = async () => {
        const auth = getAuth(app);
        try {
            await signOut(auth);
        } catch (error) {
            console.log("Failed to logout", error);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
