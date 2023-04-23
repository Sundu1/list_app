import "./App.css";
import react, { useContext, useState, useMemo, useEffect } from "react";
import Login from "./pages/Login.js";
import Home from "./pages/Home";
import List from "./pages/List";
import { Router, Route, Routes } from "react-router-dom";
import { LoginProvider, UserContext } from "./components/LoginProvider";

function App() {
  const user = localStorage.getItem("user");
  const [value, setValue] = useState(null);

  useEffect(() => {
    setValue(user);
  }, []);

  return (
    <UserContext.Provider value={{ value, setValue }}>
      <Routes>
        <Route path="/" element={<Login />} />
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
      </Routes>
    </UserContext.Provider>
  );
}

export default App;
