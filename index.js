const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./db');
const User = require('./models/User');
const Note = require('./models/Note');
const Tag = require('./models/Tag');
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');

const app = express();
app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/notes', notesRoutes);

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
  });
});
