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

export { editRow };
