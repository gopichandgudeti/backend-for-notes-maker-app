const express = require('express');
const { Op } = require('sequelize');
const Note = require('../models/Note');
const Tag = require('../models/Tag');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.use(authenticate);

router.post('/', async (req, res) => {
  const { title, content, color, tags } = req.body;
  const note = await Note.create({ title, content, color, userId: req.user.id });
  if (tags && tags.length) {
    await Promise.all(tags.map(tag => Tag.create({ name: tag, noteId: note.id })));
  }
  res.json(note);
});

router.get('/', async (req, res) => {
  const notes = await Note.findAll({
    where: {
      userId: req.user.id,
      archived: false,
      deletedAt: { [Op.is]: null }
    },
    include: Tag
  });
  res.json(notes);
});

router.get('/archived', async (req, res) => {
  const notes = await Note.findAll({
    where: {
      userId: req.user.id,
      archived: true,
      deletedAt: { [Op.is]: null }
    },
    include: Tag
  });
  res.json(notes);
});

router.get('/deleted', async (req, res) => {
  const notes = await Note.findAll({
    where: {
      userId: req.user.id,
      deletedAt: { [Op.not]: null },
      deletedAt: {
        [Op.gt]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000)
      }
    },
    include: Tag
  });
  res.json(notes);
});

router.get('/label/:label', async (req, res) => {
  const notes = await Note.findAll({
    where: {
      userId: req.user.id,
      archived: false,
      deletedAt: { [Op.is]: null }
    },
    include: {
      model: Tag,
      where: { name: req.params.label }
    }
  });
  res.json(notes);
});

router.put('/:id', async (req, res) => {
  const { title, content, color, tags } = req.body;
  const note = await Note.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  note.title = title;
  note.content = content;
  note.color = color;
  await note.save();
  if (tags && tags.length) {
    await Tag.destroy({ where: { noteId: note.id } });
    await Promise.all(tags.map(tag => Tag.create({ name: tag, noteId: note.id })));
  }
  res.json(note);
});

router.delete('/:id', async (req, res) => {
  const note = await Note.findOne({ where: { id: req.params.id, userId: req.user.id } });
  if (!note) {
    return res.status(404).json({ error: 'Note not found' });
  }
  note.deletedAt = new Date();
  await note.save();
  res.json({ message: 'Note deleted' });
});

module.exports = router;
