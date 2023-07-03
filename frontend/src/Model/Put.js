import React from "react";
import axios from "axios";
import { BASE_URL } from "./config.js";

const editRow = async (editRowData) => {
  try {
    const response = await axios({
      method: "put",
      url: `${BASE_URL}/edit-row-data`,
      data: editRowData,
    });
    const data = await response.data;
  } catch (err) {
    console.error(err);
  }
};

const udpateNewDesign = async (designName, designObjects, user, valuecounts, screenshotimg) => {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/update-design`,
      data: {
        designName,
        designObjects : JSON.stringify(designObjects[0]),
        user,
        valuecounts : JSON.stringify(valuecounts),
        screenshotimg
      },
    });
    const data = await response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

export { editRow ,udpateNewDesign};
