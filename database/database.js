const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('blog_press', 'root', '300387', {
    host: 'localhost',
    dialect: 'mysql'
  });

module.exports = sequelize;

