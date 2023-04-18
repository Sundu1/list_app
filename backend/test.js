const { error, log } = require("console");
const express = require("express");
require("dotenv").config();

const app = express();
const port = 5000;

const sql = require("mssql");
const config = {
  user: process.env.USER,
  password: process.env.PWD,
  database: process.env.DATABASE,
  server: process.env.SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};

async function getAll(value) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`select * from ${value}`);

    const tablevalues = {};
    tablevalues[value] = result.recordset;

    return tablevalues;
  } catch (err) {
    console.error(err);
  }
}

async function post(table, object) {
  try {
    const table = "ComplaintAndSuggestionList";
    const insertValues = new Object({
      ComplaintSuggestion: "sdfsdfsdfsdf",
      ComplaintType: "tessdfsdfsdfsdft001",
      ComplaintReason: "testsdfsdfsdfdsfs001",
      ComplaintResolution: "",
      ComplaintResolution_date: "2023-04-05",
      ResponsibleEmployee: "test0sdfsdf01",
      Location: "",
      CreatedAt: "2023-04-05",
      CreatedBy: "",
      ComplaintDate: "2023-04-05",
      ModifiedAt: "2023-04-05",
      ModifiedBy: "2023-04-05",
    });

    let columns = "";
    let values = "";

    for (const [key, value] of Object.entries(object)) {
      columns += key + ",";
      if (value == "") {
        values += value + "null" + ",";
      } else {
        values += "'" + value + "'" + ",";
      }
    }

    let query = `insert into ${table} (${columns.slice(
      0,
      -1
    )}) values (${values.slice(0, -1)})`;

    let pool = await sql.connect(config);
    await pool.request().query(query);
  } catch (err) {
    console.error(err);
  }
}

app.post("/", (req, res) => {
  post(table, insertValues);
  res.send("post");
});

async function createTable(tableObject) {
  try {
    const tableName = tableObject["tableName"];
    const values = tableObject["values"];
    let tableValues = "";

    for (const [key, value] of Object.entries(values)) {
      tableValues += `${key} ${value["type"]} ${
        value["isnull"] == "no" ? "NOT NULL" : "NULL"
      },\n`;
    }

    const query = `CREATE TABLE ${tableName}(${tableValues})`;

    let pool = await sql.connect(config);
    await pool.request().query(query);
  } catch (err) {
    console.error(err);
  }
}

app.post("/create-table", (req, res) => {
  const tableObject = {
    tableName: "testTable",
    values: {
      Id: {
        type: "INT PRIMARY KEY",
        isnull: "no",
      },
      name: {
        type: "NVARCHAR(255)",
        isnull: "no",
      },
      age: {
        type: "INT",
        isnull: "yes",
      },
      birthday: {
        type: "DATETIME",
        isnull: "yes",
      },
    },
  };

  createTable(tableObject);
  res.send("create-table");
});

app.get("/", (req, res) => {
  const table = "ComplaintAndSuggestionList";
  getAll(table);
  res.send("done");
});

app.listen(port, function () {
  console.log("Server is listening at port 5000...");
});
