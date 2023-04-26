import React from "react";
import axios from "axios";
import { BASE_URL } from "./config.js";

const getTableValue = async (tableName, setTable) => {
  try {
    if (localStorage.getItem(tableName)) {
      setTable(JSON.parse(localStorage.getItem(tableName)));
      return;
    }

    const response = await axios({
      method: "get",
      url: `${BASE_URL}/list/${tableName}`,
    });
    const data = await response.data;
    setTable(data);
    localStorage.setItem(tableName, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const getTableList = async (setTableList, user) => {
  try {
    // if (localStorage.getItem("tablelist")) {
    //   setTableList(JSON.parse(localStorage.getItem("tablelist")));
    //   return;
    // }
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/tablelist/${user}`,
    });
    const data = await response.data;
    setTableList(data);
    // localStorage.setItem("tablelist", JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

export { getTableValue, getTableList };
