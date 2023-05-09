import React from "react";
import axios from "axios";
import { BASE_URL } from "./config.js";

const DeleteRow = async (deleteRowsInfo) => {
  try {
    const response = await axios({
      method: "delete",
      url: `${BASE_URL}/delete-rows`,
      data: deleteRowsInfo,
    });
    const data = await response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

const DeleteColumn = async (deleteColumnInfo) => {
  try {
    const response = await axios({
      method: "delete",
      url: `${BASE_URL}/delete-column`,
      data: deleteColumnInfo,
    });
    const data = await response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

export { DeleteRow, DeleteColumn };
