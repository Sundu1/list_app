import React from "react";
import axios from "axios";

const getAll = async (tableName, setTable) => {
  try {
    if (localStorage.getItem(tableName)) {
      setTable(JSON.parse(localStorage.getItem(tableName)));
      return;
    }

    const response = await axios({
      method: "get",
      url: `http://localhost:5000/${tableName}`,
    });
    const data = await response.data;
    localStorage.setItem(tableName, JSON.stringify(data));
    setTable(data);
  } catch (err) {
    console.error(err);
  }
};

export { getAll };
