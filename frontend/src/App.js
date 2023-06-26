import "./App.css";
import react, { useContext, useState, useMemo, useEffect } from "react";
import Login from "./pages/Login.js";
import Home from "./pages/Home";
import List from "./pages/List";
import Signup from "./pages/Signup";
import Design from "./pages/Design";
import DesignList from "./pages/DesignList";

import { Router, Route, Routes } from "react-router-dom";
import {
  LoginProvider,
  UserContext,
  IsLoggedIn,
} from "./components/LoginProvider";

function App() {
  const [value, setValue] = useState({});

  useEffect(() => {
    setValue(
      localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : {}
    );
  }, []);

  return (
    <UserContext.Provider value={{ value, setValue }}>
      <Routes>
        <Route
          path="/"
          element={
            <IsLoggedIn>
              <Login />
            </IsLoggedIn>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <LoginProvider>
              <Home />
            </LoginProvider>
          }
        />
        <Route
          path="/list/:tableName"
          element={
            <LoginProvider>
              <List />
            </LoginProvider>
          }
        />
        <Route
          path="/design/:designTable"
          element={
            <LoginProvider>
               <Design />
            </LoginProvider>
          }
        />
        <Route
          path="/apps"
          element={
            <LoginProvider>
              <DesignList />
            </LoginProvider>
          }
        />
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
