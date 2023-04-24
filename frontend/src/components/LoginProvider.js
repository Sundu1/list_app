import React, { useEffect, useState, createContext } from "react";
import { Navigate } from "react-router-dom";

const UserContext = createContext(null);

const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  return user ? children : <Navigate to="/" />;
};

const IsLoggedIn = ({ children }) => {
  const [user, setUser] = useState(localStorage.getItem("user"));
  return user ? <Navigate to="/home" /> : children;
};

export { LoginProvider, UserContext, IsLoggedIn };
