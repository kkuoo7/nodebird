
require("dotenv").config(); // config.json 이면 dotenv를 못 쓰니까 
// config.js로 바꾸고 나서 dotenv 사용 (= process.env.~~) 

module.exports = {
  "development": {
    "username": "root",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging" : false
  },
  "test": {
    "username": "root",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "nodebird_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging": false

  },
  "production": {
    "username": "root",
    "password": process.env.SEQUELIZE_PASSWORD,
    "database": "nodebird",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "logging" : false,
  }
};
