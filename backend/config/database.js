const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("sevaconnect", "root", "Yash@2004", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
