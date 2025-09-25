// config/config.js
module.exports = {
  development: {
    username: "root",
    password: "Yash@2004",
    database: "sevaconnect",
    host: "localhost",       // ✅ host must be a string
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: "Yash@2004",
    database: "sevaconnect_test",
    host: "localhost",
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: "Yash@2004",
    database: "sevaconnect_prod",
    host: "localhost",
    dialect: "mysql"
  }
};
