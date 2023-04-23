import React, { useEffect, useState, createContext } from "react";
import { Navigate } from "react-router-dom";

const UserContext = createContext(null);

const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  return user ? children : <Navigate to="/" />;
};

export { LoginProvider, UserContext };
