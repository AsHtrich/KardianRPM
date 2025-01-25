import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export const UserProvider = (props) => {
     const [token, setToken] = useState(localStorage.getItem("aintIawesome"));

     useEffect(() => {
        const fetchUser = async () => {
            const requestOptions = {
                method : "GET",
                headers: {
                    "Content-Type" : "aplication/json",
                    Authorization: "Bearer " + token,
                },
            };
        const response = await fetch("/api/users/me", requestOptions);
        if(!response.ok) {
            setToken(null);
        } 
            localStorage.setItem("aintIawesome", token);       
        };
        fetchUser();
     }, [token]); 
     return (
        <UserContext.Provider value={[token, setToken]}>
            {props.children}
        </UserContext.Provider>
     )
};