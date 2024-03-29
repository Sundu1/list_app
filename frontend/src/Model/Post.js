import React from "react";
import axios from "axios";
import { BASE_URL } from "./config.js";

const createNewRow = async (createNewRowData) => {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/create-new-row`,
      data: createNewRowData,
    });
    const data = await response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

const SignIn = async (Username, Password) => {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/sign-in`,
      data: {
        Username,
        Password,
      },
    });
    const data = await response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

const SignUp = async (Username, Password) => {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/sign-up`,
      data: {
        Username,
        Password,
      },
    });
    const data = await response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

const insertNewTable = async (tableName, user) => {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/create-table`,
      data: {
        tableName,
        user,
      },
    });
    const data = await response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

const addColumnPost = async (tableName, user, columnInfo) => {
  try {
    console.log(tableName, user, columnInfo);
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/add-column`,
      data: {
        tableName,
        user,
        columnInfo,
      },
    });
    const data = await response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

const createNewDesign = async (designName, designObjects, user, valuecounts) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/create-design`,
      {
        designName,
        designObjects : JSON.stringify(designObjects[0]),
        user,
        valuecounts : JSON.stringify(valuecounts),
      },
      {
        headers: { 'Content-Type': 'application/json'},
      }
    );
    const data = await response.data;
    return data;
  } catch (err) {
    console.error(err);
  }
};

const postImage = async(image) =>{
  try {
    const formData = new FormData()
    // formData.append("image", image)
    for (const file of image) {
      formData.append("image", file);
    }

    axios.post(`${BASE_URL}/image`, 
                formData, 
                {
                headers: { 'Content-Type': 'multipart/form-data' }
                }
              )
  } catch (error) {
    console.error(error)
  }
}

export { createNewRow, SignIn, insertNewTable, addColumnPost, createNewDesign, postImage};
