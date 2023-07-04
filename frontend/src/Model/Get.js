import React from "react";
import axios from "axios";
import { BASE_URL } from "./config.js";
import { LoginProvider } from "../components/LoginProvider.js";

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

const getDesignList = async (setTableList, user) => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/designlist/${user}`,
      withCredentials: true,
    });
    const data = await response.data;
    if(data !== "error"){
      setTableList(data);
    }
  } catch (err) {
    console.error(err);
  }
};

const getDesignSingle = async (setSigleDesign, user, designName) => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/designlist/${user.Username}/${designName}`,
    });
    const data = await response.data;
    setSigleDesign(data[0])
  } catch (err) {
    console.error(err);
  }
};

const getSingleDesign1 = async (user, designName) => {
  try {
    const response = await axios({
      method: "get",
      url: `${BASE_URL}/designlist/${user.Username}/${designName}`,
    });
    const data = await response.data;
    return data
  } catch (err) {
    console.error(err);
  }
};

export { getTableValue, getTableList, getDesignList, getDesignSingle, getSingleDesign1};

// if (localStorage.getItem(tableName)) {
//   setTable(JSON.parse(localStorage.getItem(tableName)));
//   return;g
// }
// localStorage.setItem(tableName, JSON.stringify(data));
