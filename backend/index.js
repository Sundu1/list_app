const { log } = require("console");
const express = require("express");
const mssql = require("mssql");
const Connection = require("tedious").Connection;
const Request = require("tedious").Request;
const TYPES = require("tedious").TYPES;

const app = express();
const config = {
  server: "test-sharepoint-list.database.windows.net",
  authentication: {
    type: "default",
    options: {
      userName: "tuggy",
      password: "test@#$123",
    },
  },
  options: {
    encrypt: true,
    database: "test-sharepoint-list",
  },
};

const connection = new Connection(config);
connection.on("connect", function (err) {
  console.log("Connected");
  executeGet("ComplaintAndSuggestionList");
});

connection.connect();

function executeGet(table) {
  const resultArray = [];

  var request = new Request(`select * from ${table}`, function (err) {
    if (err) {
      console.log(err);
    }
  });

  request.on("row", function (columns) {
    let resultObject = {};

    columns.forEach(function (column) {
      if (column.value === null) {
        resultObject[column.metadata.colName] = null;
      } else {
        resultObject[column.metadata.colName] = column.value;
      }
    });
    resultArray.push(resultObject);
  });

  connection.execSql(request);

  console.log(resultArray);
}

app.listen(5000, function () {
  console.log("Server is listening at port 5000...");
});
