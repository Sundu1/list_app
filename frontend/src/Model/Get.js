import React from "react";
import axios from "axios";
import { BASE_URL } from "./config.js";

const getAll = async (tableName, setTable, isChanged) => {
  try {
    if (localStorage.getItem(tableName) && isChanged != true) {
      setTable(JSON.parse(localStorage.getItem(tableName)));
      return;
    }

    const response = await axios({
      method: "get",
      url: `${BASE_URL}/${tableName}`,
    });
    const data = await response.data;
    setTable(data);
    localStorage.setItem(tableName, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

export { getAll };
