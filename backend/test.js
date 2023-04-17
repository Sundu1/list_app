const { error, log } = require("console");
const express = require("express");
const app = express();
const port = 5000;

const sql = require("mssql");
const config = {
  user: "tuggy",
  password: "test@#$123",
  database: "test-sharepoint-list",
  server: "test-sharepoint-list.database.windows.net",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    encrypt: true, // for azure
    trustServerCertificate: false, // change to true for local dev / self-signed certs
  },
};

async function getAll(value) {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    let pool = await sql.connect(config);
    let result = await pool.request().query(`select * from ${value}`);

    const test = {};
    test[value] = result.recordset;

    console.log(test);
    return result.recordset;
  } catch (err) {
    console.error(err);
  }
}

async function post(table, object) {
  try {
    let columns = "";
    let values = "";
    let len = Object.entries(object).length;

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
    console.log(query);

    let pool = await sql.connect(config);
    await pool.request().query(query);
  } catch (err) {
    console.error(err);
  }
}

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

app.post("/", (req, res) => {
  post(table, insertValues);
  res.send("post");
});

app.get("/", (req, res) => {
  getAll(value);
  res.send("done");
});

app.listen(port, function () {
  console.log("Server is listening at port 5000...");
});
