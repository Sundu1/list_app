const Pool = require("pg").Pool;

class Sunsql {
  constructor(props) {
    this.pool = new Pool(props);
  }
  print() {
    console.log(this.pool);
  }
  designTable = new DesignTable(this);
}

class DesignTable {
  constructor(sqlClient) {
    this.sqlClient = sqlClient;
  }

  init(userSchemeName) {
    this.userSchemeName = userSchemeName;
  }

  async create({ data, checkDuplicates }) {
    const findMany = await this.findMany({
      where: {
        name: data.name,
      },
    });

    
    if (checkDuplicates && findMany.length > 0)
    return "this value already exist";
    
    const result = await this.sqlClient.pool
    .query(`insert into ${this.userSchemeName}.design_table(designName, jsonValue, valuecounts)
    values('${data.name}', '${data.json}', '${data.valuecounts}')`);

    return result ? "created successfully" : "did not created";
  }

  async findMany({ where }) {
    if (where.name) {
      const result = await this.sqlClient.pool.query(`
        select * from ${this.userSchemeName}.design_table 
        where designname = '${where.name}'
      `);
      return result.rows;
    }
    return "either key or value is wrong or null";
  }

  async findAll() {
   try {
    const result = await this.sqlClient.pool.query(`
    select * from ${this.userSchemeName}.design_table`);
    return result.rows ? result.rows : "empty";
   } catch (error) {
    return "error"
   }
  }

  async delete({ where }) {
    const findMany = await this.findMany({
      where: {
        name: where.name,
      },
    });

    if (findMany.length > 1) return "Multiple values exist";
    if (findMany.length == 0) return "no values found";

    const result = await this.sqlClient.pool.query(`
    delete from ${this.userSchemeName}.design_table 
    where designName = '${where.name}'
    `);
    return result.rows ? "Deleted successfully" : "Delete failed";
  }

  async deleteMany({ where }) {
    if (where.name) {
      const result = await this.sqlClient.pool.query(`
      delete from ${this.userSchemeName}.design_table 
      where designName = '${where.name}'
      `);
      return result.rows ? "deleted successfully" : "delete failed";
    }
    return "Either key or value is wrong or null";
  }

  async updateMany({where}) {
    if (where.name){
      const result = await this.sqlClient.pool.query(`
         update ${this.userSchemeName}.design_table as t
         set jsonValue = '${where.jsonValue}', valuecounts = '${where.valuecounts}', screenshotimg = '${where.screenshotimg}'
         where t.designName = '${where.name}'
      `)
      return result.rows ? "deleted successfully" : "delete failed";
    }
    return "Either key or value is wrong or null";
  }
}

module.exports = Sunsql;
