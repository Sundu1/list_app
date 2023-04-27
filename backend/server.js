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

const today = new Date().toLocaleDateString();

async function getAll(tableName, user) {
  try {
    const columns_query = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = '${user}'
        AND table_name   = '${tableName}'
        AND column_name != 'pkid'
    `);
    let list_query = "";
    columns_query.rows.forEach((value) => {
      if (value.column_name != "pkid") list_query += `'${value.column_name}',`;
    });

    const result = await pool.query(`
        SELECT ${list_query.slice(0, -1)} 
        FROM ${user}.${tableName}
    `);

    const tablevalues = new Object({
      tableName: tableName,
      data: {
        columns: columns_query.rows,
        tableValues: result.rows,
      },
    });

    return tablevalues;
  } catch (err) {
    console.error(err);
  }
}

async function createNewRow(createNewRowData) {
  try {
    console.log("sdfsdfsdfsd", createNewRowData);
    let columns = "";
    let values = "";
    for (const [key, value] of Object.entries(createNewRowData.Values)) {
      columns += key + ",";
      if (value == "") {
        values += value + "null" + ",";
      } else {
        values += "'" + value + "'" + ",";
      }
    }
    console.log(columns);
    console.log(values);
    // let query = `insert into ${table} (${columns.slice(
    //   0,
    //   -1
    // )}) values (${values.slice(0, -1)})`;
    // await pool.query(query);
  } catch (err) {
    console.error(err);
  }
}

async function createTable(tableName, user) {
  try {
    const tableName_replaced = tableName.replaceAll(" ", "_");
    const tables = await pool.query(`
                  select table_name 
                  from information_schema.tables
                  where table_schema = '${user}'`);

    const tablesExistList = [];
    for (const [key, value] of Object.entries(tables.rows)) {
      tablesExistList.push(value.table_name);
    }

    if (tablesExistList.includes(`${tableName_replaced}`)) {
      return { message: "table already exist" };
    } else {
      const isTableExist =
        await pool.query(`CREATE TABLE ${user}.${tableName_replaced}(
        PkId int PRIMARY KEY
      )`);
      if (isTableExist) {
        await pool.query(`insert into ${user}.TableList (tablename, createdby, createat, modifiedby, modifiedat)
                          values ('${tableName_replaced}', '${user}', '${today}', '${user}', '${today}')`);
        return { message: "table created successfully" };
      }
    }
  } catch (err) {
    console.error(err);
  }
}

async function getTableList(user) {
  try {
    const query = `select  
                        TableName,
                        CreatedBy,
                        CreateAt,
                        ModifiedBy,
                        ModifiedAt
                    from ${user}.TableList`;

    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.error(err);
  }
}

async function addColumn(tablename, user, column_info) {
  const types = {
    Number: "int",
    Text: "varchar(255)",
    Date: "timestamp",
  };
  const isAltered = pool.query(`
    ALTER TABLE ${user}.${tablename}
    ADD COLUMN "${column_info.Name}" ${types[column_info.Type]}
  `);

  if (isAltered) {
    return { message: "altered" };
  }
  return { message: "not altered" };
}

app.get("/tablelist/:user", async (req, res) => {
  const { user } = req.params;
  const tablelist = await getTableList(user);
  if (tablelist) {
    res.send(tablelist);
    return;
  }
  res.send("not worked");
});

app.get("/list/:User/:tableName", async (req, res) => {
  const { User, tableName } = req.params;
  const tableValues = await getAll(tableName, User);
  res.send(tableValues);
});

app.post("/sign-up", async (req, res) => {
  const data = req.body;
  const isUserExist = await pool.query(
    `select Username from Users where Username = '${data.Username}'`
  );

  if (isUserExist.rows.length > 0) {
    res.send({ message: "User already exist" });
    return;
  } else {
    const password = bcrypt.hashSync(data.Password);
    const createBy = "admin";

    const insertUser = await pool.query(`
                      insert into Users (Username, 
                                           Email, 
                                           Password, 
                                           CreatedAt, 
                                           CreatedBy, 
                                           ModifiedAt, 
                                           ModifiedBy)
                        values ('${data.Username}', 
                                '${data.Email}', 
                                '${password}',
                                '${today}',
                                '${createBy}', 
                                '${today}', 
                                '${createBy}')`);

    if (insertUser) {
      const isSchemaExist = await pool.query(`CREATE SCHEMA ${data.Username}`);
      if (isSchemaExist) {
        await pool.query(`
                    CREATE TABLE ${data.Username}.TableList(
                    PkId integer not null generated always as identity (increment by 1),
                    constraint pk_${data.Username}_tablelist primary key (PkId),
                    TableName varchar(255) not null,
                    CreatedBy varchar(255) not null,
                    CreateAt timestamp not null,
                    ModifiedBy varchar(255) not null,
                    ModifiedAt timestamp not null
                  )`);
        res.send("yes");
        return;
      }
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

app.post("/create-new-row", (req, res) => {
  const data = req.body;
  createNewRow(data);
  res.send("done");
});

app.post("/create-table", async (req, res) => {
  const { tableName, user } = req.body;
  const result = await createTable(tableName, user);
  res.send(result);
});

app.post("/add-column", async (req, res) => {
  const { tableName, user, columnInfo } = req.body;
  const data = await addColumn(tableName, user, columnInfo);
  res.send(data);
});

app.listen(port, function () {
  console.log("Server is listening at port 5000...");
});
