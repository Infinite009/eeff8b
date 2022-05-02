const Sequelize = require("sequelize");
const db = require("../db");

const Participant = db.define("participant", {
  lastReadId: {
    type: Sequelize.INTEGER,
    allowNull: true,
  },
});

module.exports = Participant;