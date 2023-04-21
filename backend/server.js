const express = require("express");
const cors = require("cors");
const sql = require("mssql");

require("dotenv").config();

const app = express();
const port = 5000;

// var corsOptions = {
//   origin: "http://example.com",
//   optionsSuccessStatus: 200,
// };
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
    encrypt: true,
    trustServerCertificate: false,
  },
};

async function getAll(tableName) {
  try {
    let pool = await sql.connect(config);
    let result = await pool.request().query(`select * from ${tableName}`);
    let result_columns = await pool.request().query(` 
                                                    SELECT 
                                                    c.name 'ColumnName',
                                                    t.Name 'DataType'
                                                    FROM    
                                                        sys.columns c
                                                    INNER JOIN 
                                                      sys.types t ON c.user_type_id = t.user_type_id
                                                    WHERE
                                                        c.object_id = OBJECT_ID('${tableName}')`);

    const tablevalues = new Object({
      tableName: tableName,
      data: {
        columns: result_columns.recordset,
        tableValues: result.recordset,
      },
    });

    return tablevalues;
  } catch (err) {
    console.error(err);
  }
}

async function post(table, object) {
  try {
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

async function getTableList() {
  try {
    const query = `select TableId, 
                          TableName,
                          CreatedBy,
                          CreateAt,
                          ModifiedBy,
                          ModifiedAt
                    from Table_list`;
    let pool = await sql.connect(config);
    const result = await pool.request().query(query);
    return result.recordsets[0];
  } catch (err) {
    console.error(err);
  }
}

app.get("/tablelist", async (req, res) => {
  const tablelist = await getTableList();
  res.send(tablelist);
});

app.get("/:tableName", async (req, res) => {
  const table = req.params.tableName;
  const tableValues = await getAll(table);
  res.send(tableValues);
});

app.post("/:tableName", (req, res) => {
  const table = req.params.tableName;
  const insertValues = req.body;
  post(table, insertValues);
  res.send("done");
});

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

app.listen(port, function () {
  console.log("Server is listening at port 5000...");
});
