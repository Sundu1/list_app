const express = require("express");
const cors = require("cors");
const multer = require('multer')
const path = require('path');
const request = require('request');

const Pool = require("pg").Pool;
const jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const configAuth = require("./auth/auth.config.js");
require("dotenv").config();

const Sunsql = require("./sql_utility.js");

const app = express();

const corsOptions = {
  origin: ["http://localhost:3000", 
           "https://list-app-80e45.web.app", 
           "https://dynamic-list-app.herokuapp.com"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
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
        AND table_name   = '${tableName.toLowerCase()}'
        `);

    console.log(columns_query.rows);
    // AND column_name != 'pkid'
    let list_query = "";
    columns_query.rows.forEach((value) => {
      // if (value.column_name != "pkid")
      list_query += `"${value.column_name}",`;
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
    const { TableName, User, Values } = createNewRowData;
    let columns = "";
    let values = "";
    for (const [key, value] of Object.entries(Values)) {
      if (key == "pkid") console.log(key);
      else {
        columns += `"${key}",`;
        if (value == "") {
          values += "null,";
        } else {
          values += `'${value}',`;
        }
      }
    }

    let query = `insert into ${User}.${TableName} (${columns.slice(
      0,
      -1
    )}) values (${values.slice(0, -1)})`;

    await pool.query(query);
  } catch (err) {
    console.error(err);
  }
}

async function deleteRows(deleteRowData) {
  const { TableName, User, delete_pkid } = deleteRowData;

  const query = `DELETE FROM ${User}.${TableName}
                 WHERE pkid in (${delete_pkid.toString()})
  `;

  const result = await pool.query(query);
  if (result) return { message: "deleted successfully" };
  else return { message: "delete failed" };
}

async function deleteColumn(deleteColumnData) {
  const { TableName, User, ColumnName } = deleteColumnData;
  const query = `ALTER TABLE ${User}.${TableName} DROP COLUMN "${ColumnName}"`;
  const result = await pool.query(query);
  if (result) return { message: "column deleted successfully" };
  else return { message: "column delete failed" };
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
            PkId integer not null generated always as identity (increment by 1),
            constraint pk_${tableName_replaced} primary key (PkId))`);
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

async function updateRowData(data) {
  const { TableName, User, editValues } = data;
  let setValues = "";
  let query = "";

  for (const [key, value] of Object.entries(editValues)) {
    if (key != "pkid")
      setValues += `"${key}"= ${value != null ? "'" + value + "'" : "null"},`;
  }
  query = `
           UPDATE ${User}.${TableName} 
           SET ${setValues.slice(0, -1)}
           WHERE pkid = ${editValues.pkid}
           `;
  const updated = await pool.query(query);
  if (updated) {
    return { message: "updated successfully" };
  }
  return { message: "update failed" };
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

app.delete("/delete-rows", async (req, res) => {
  const data = req.body;
  const result = await deleteRows(data);
  res.send(result);
});

app.delete("/delete-column", async (req, res) => {
  const data = req.body;
  const result = await deleteColumn(data);
  res.send(result);
});

app.put("/edit-row-data", async (req, res) => {
  const data = req.body;
  updateRowData(data);
});

const sunsql = new Sunsql({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/designlist/:user", async (req, res) => {
  sunsql.designTable.init("admin");
  const result = await sunsql.designTable.findAll();
  res.send(result);
});

app.get("/designlist/:user/:designName", async (req, res) => {
  const {user, designName} = req.params

  sunsql.designTable.init(user);
  const result = await sunsql.designTable.findMany({
    where:{
      name : designName
    }
  });

  console.log(result);
  res.send(result)
}); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/')
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  },
})

const upload = multer({ storage: storage })

app.post('/image', upload.any("image"), function (req, res) {
  res.json({})
})

app.post("/create-design",  async(req, res) =>{
  const {designName, designObjects, user, valuecounts} = req.body

  sunsql.designTable.init(user.Username);
  const create = await sunsql.designTable.create({
    data: {
      name: designName,
      json: designObjects,
      valuecounts: valuecounts,
    },
    checkDuplicates: true,
  });

  res.send(create)
})

app.put("/update-design", async(req, res)=>{
  const {designName, designObjects, user, valuecounts, screenshotimg} = req.body

  sunsql.designTable.init(user.Username);
  const result = await sunsql.designTable.updateMany({
    where:{
      name : designName,
      jsonValue: designObjects,
      valuecounts: valuecounts,
      screenshotimg
    }
  });
  res.send(result)
})

app.delete("/delete-design", async(req, res) =>{
  const {user, designName} = req.body
  sunsql.designTable.init(user.Username);
  const result = await sunsql.designTable.deleteMany({
    where:{
      name : designName,
    }
  });

  if(result !== "error"){
    res.send(result)
  }
})

// const port = process.env.PORT || 5000
const port = 5000
app.listen(port, function () {
  console.log(`Server is listening at port ${port}...`);
});