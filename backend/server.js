const express = require("express");
const bodyParser = require("body-parser");
const { PrismaClient, Prisma } = require("@prisma/client");
// const shell = require("shelljs"); // might use it later

const prisma = new PrismaClient();

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/post-complaint", async (req, res) => {
  let data = req.body;
  if (data) {
    data["ComplaintResolution_date"] = new Date(
      data["ComplaintResolution_date"]
    );
    data["ComplaintDate"] = new Date(data["ComplaintDate"]);
    data["ModifiedAt"] = new Date(data["ModifiedAt"]);

    await prisma.complaintAndSuggestionList.create({
      data: data,
    });
  }
  res.send("done");
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
