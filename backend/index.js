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
  executeStatement();
});

connection.connect();

function executeStatement() {
  var request = new Request(
    "select * from ComplaintAndSuggestionList",
    function (err) {
      if (err) {
        console.log(err);
      }
    }
  );

  var result = "";
  request.on("row", function (columns) {
    columns.forEach(function (column) {
      if (column.value === null) {
        console.log("NULL");
      } else {
        result += column.value + " ";
      }
    });
    console.log(result);
    result = "";
  });

  request.on("done", function (rowCount, more) {
    console.log(rowCount + " rows returned");
  });

  // Close the connection after the final event emitted by the request, after the callback passes
  request.on("requestCompleted", function (rowCount, more) {
    connection.close();
  });
  connection.execSql(request);
}

app.listen(5000, function () {
  console.log("Server is listening at port 5000...");
});
