const { Sequelize } = require("sequelize");
require("dotenv").config();

const url = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL || process.env.DATABASE_URL;
const ssl = String(process.env.DB_SSL || "false").toLowerCase() === "true";
const connectTimeout = Number(process.env.DB_CONNECT_TIMEOUT || 15000);
const dialectOptions = {};
if (ssl) {
  dialectOptions.ssl = { require: true, rejectUnauthorized: false };
}
dialectOptions.connectTimeout = connectTimeout;
const common = {
  dialect: process.env.DB_DIALECT || "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  define: { timestamps: false, underscored: true },
  dialectOptions,
};

if (url) {
  module.exports = new Sequelize(url, common);
} else {
  const host = process.env.MYSQLHOST || process.env.DB_HOST;
  const port = Number(process.env.MYSQLPORT || process.env.DB_PORT || 3306);
  const database = process.env.MYSQLDATABASE || process.env.DB_NAME;
  const user = process.env.MYSQLUSER || process.env.DB_USER;
  const password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD;

  module.exports = new Sequelize(database, user, password, {
    host,
    port,
    ...common,
  });
}
