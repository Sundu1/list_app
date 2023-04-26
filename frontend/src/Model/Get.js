import React from "react";
import axios from "axios";
import { BASE_URL } from "./config.js";

const getTableValue = async (tableName, setTable, user) => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/list/${user}/${tableName}`,
    });
    const data = await response.data;
    setTable(data);
  } catch (err) {
    console.error(err);
  }
};

const getTableList = async (setTableList, user) => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/tablelist/${user}`,
    });
    const data = await response.data;
    setTableList(data);
  } catch (err) {
    console.error(err);
  }
};

export { getTableValue, getTableList };

// if (localStorage.getItem(tableName)) {
//   setTable(JSON.parse(localStorage.getItem(tableName)));
//   return;
// }
// localStorage.setItem(tableName, JSON.stringify(data));
