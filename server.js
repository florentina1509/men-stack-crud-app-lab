const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const path = require('path');
require('dotenv').config();

const Series = require('./models/series');

const app = express();
const PORT = process.env.PORT || 3000;

// Set view engine and views folder
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

// ROUTES

// Home redirect to /series
app.get('/', (req, res) => {
  res.redirect('/series');
});

// INDEX - List all series
app.get('/series', async (req, res) => {
  try {
    const allSeries = await Series.find();
    res.render('series/index', { series: allSeries });
  } catch (err) {
    res.status(500).send('Error fetching series');
  }
});

// NEW - Show form to create a new series
app.get('/series/new', (req, res) => {
  res.render('series/new');
});

// CREATE - Add new series to DB
app.post('/series', async (req, res) => {
  try {
    req.body.isCompleted = req.body.isCompleted === 'on';
    req.body.leadCharacters = req.body.leadCharacters
      ? req.body.leadCharacters.split(',').map(c => c.trim())
      : [];
    await Series.create(req.body);
    res.redirect('/series');
  } catch (err) {
    res.status(500).send('Error creating series');
  }
});

// SHOW - Show a single series
app.get('/series/:id', async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    res.render('series/show', { series });
  } catch (err) {
    res.status(500).send('Error loading series');
  }
});

// EDIT - Show edit form
app.get('/series/:id/edit', async (req, res) => {
  try {
    const series = await Series.findById(req.params.id);
    res.render('series/edit', { series });
  } catch (err) {
    res.status(500).send('Error loading edit form');
  }
});

// UPDATE - Handle edit form submit
app.put('/series/:id', async (req, res) => {
  try {
    req.body.isCompleted = req.body.isCompleted === 'on';
    req.body.leadCharacters = req.body.leadCharacters
      ? req.body.leadCharacters.split(',').map(c => c.trim())
      : [];
    await Series.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/series/${req.params.id}`);
  } catch (err) {
    res.status(500).send('Error updating series');
  }
});

// DELETE - Delete a series
app.delete('/series/:id', async (req, res) => {
  try {
    await Series.findByIdAndDelete(req.params.id);
    res.redirect('/series');
  } catch (err) {
    res.status(500).send('Error deleting series');
  }
});
