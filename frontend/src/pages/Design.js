import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../components/LoginProvider";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Design = () => {
  const { designTable } = useParams();
  const { value, setValue } = useContext(UserContext);

  return (
    <div>
      <Navbar />
    </div>
  );
};

export default Design;
