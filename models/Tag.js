const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Note = require('./Note');

const Tag = sequelize.define('Tag', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Tag.belongsTo(Note);

module.exports = Tag;
