const Sequelize = require("sequelize");

const conection = new Sequelize("guiaperguntas", 'root', '3vn@z&01', {
    host:  'localhost',
    dialect: "mysql"
});

module.exports = conection;