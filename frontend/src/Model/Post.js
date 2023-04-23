import React from "react";
import axios from "axios";
import { BASE_URL } from "./config.js";

const Post = async (tableName, insertValues) => {
  try {
    const response = await axios({
      method: "post",
      url: `${BASE_URL}/${tableName}`,
      data: new Object(insertValues),
    });
    const data = await response.data;
    return "yes";
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

export { Post, SignIn };
