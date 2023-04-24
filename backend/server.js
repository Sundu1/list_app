const express = require("express");
const cors = require("cors");
const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const configAuth = require("./auth/auth.config.js");

require("dotenv").config();

const app = express();
const port = 5000;

var corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
  user: "pdscooffpjuazx",
  host: "ec2-107-21-67-46.compute-1.amazonaws.com",
  database: "de93ur7e92jd95",
  password: "392d7229bf05e5ac9328e6e58857c97f2fe641f76aa472bad7f61c21e64f0278",
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function getAll(tableName) {
  try {
    let result = await pool.query(`
                      select * INTO #TempTable 
                      from ${tableName}
                      ALTER TABLE #TempTable
                      DROP COLUMN PkId
                      SELECT * FROM #TempTable
                      DROP TABLE #TempTable`);
    let result_columns = await pool.request().query(` 
                      SELECT 
                      c.name 'ColumnName',
                      t.Name 'DataType'
                      FROM    
                          sys.columns c
                      INNER JOIN 
                        sys.types t ON c.user_type_id = t.user_type_id
                      WHERE
                          c.object_id = OBJECT_ID('${tableName}') and
                          c.name != 'PkId'`);

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

    await pool.query(query);
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

    await pool.query(query);
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

    const result = await pool.query(query);
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

const today = new Date().toLocaleDateString();

app.post("/sign-up", async (req, res) => {
  const data = req.body;
  const isUserExist = await pool.query(
    `select Username from Users where Username = '${data.Username}'`
  );

  console.log(isUserExist.rows);
  if (isUserExist.rows.length > 0) {
    res.send({ message: "User already exist" });
    return;
  } else {
    const password = bcrypt.hashSync(data.Password);
    const createBy = "admin";

    const insertUser =
      await pool.query(`insert into Users (Username, Email, Password, CreatedAt, CreatedBy, ModifiedAt, ModifiedBy)
                        values ('${data.Username}', 
                                '${data.Email}', 
                                '${password}',
                                '${today}',
                                '${createBy}', 
                                '${today}', 
                                '${createBy}')`);

    if (insertUser) {
      res.send("yes");
      return;
    }
    res.send("no");
  }
});

app.post("/sign-in", async (req, res) => {
  const data = req.body;
  const isUserExist = await pool.query(
    `select * from Users where Username = '${data.Username}'`
  );

  if (isUserExist.rows.length > 0) {
    const user = isUserExist.rows[0];
    console.log(user);
    const token = jwt.sign({ id: user.PkId }, configAuth.secret);
    const passwordIsValid = bcrypt.compareSync(data.Password, user.password);
    if (passwordIsValid) {
      res.send({
        Username: user.username,
        Email: user.email,
        passwordIsValid,
        token,
        result: true,
      });
      return;
    }
    res.send({ message: "password Is Not Valid", result: false });
  } else {
    res.send({ message: "Username not found" });
  }
});

app.post("/list/:tableName", (req, res) => {
  const table = req.params.tableName;
  const insertValues = req.body;
  post(table, insertValues);
  res.send("done");
});

app.post("/create-table", (req, res) => {
  // const tableObject = {
  //   tableName: "testTable",
  //   values: {
  //     Id: {
  //       type: "SERIAL PRIMARY KEY",
  //       isnull: "no",
  //     },
  //     name: {
  //       type: "VARCHAR(255)",
  //       isnull: "no",
  //     },
  //     age: {
  //       type: "INT",
  //       isnull: "yes",
  //     },
  //     birthday: {
  //       type: "DATETIME",
  //       isnull: "yes",
  //     },
  //   },
  // };

  // createTable(tableObject);
  res.send("create-table");
});

app.listen(port, function () {
  console.log("Server is listening at port 5000...");
});
