const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Note = sequelize.define('Note', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: 'white',
  },
  archived: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

Note.belongsTo(User);

module.exports = Note;
