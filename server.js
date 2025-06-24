const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require('dotenv').config();

const Series = require('./models/series');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB error:', err));

// ROUTES

// Home redirect
app.get('/', (req, res) => {
  res.redirect('/series');
});

// INDEX - Show all series
app.get('/series', async (req, res) => {
  const allSeries = await Series.find();
  res.render('series/index', { series: allSeries });
});

// NEW - Show form
app.get('/series/new', (req, res) => {
  res.render('series/new');
});

// CREATE - Add to DB
app.post('/series', async (req, res) => {
  req.body.isCompleted = req.body.isCompleted === 'on';
  req.body.leadCharacters = req.body.leadCharacters.split(',').map(c => c.trim());
  await Series.create(req.body);
  res.redirect('/series');
});

// SHOW - Single series
app.get('/series/:id', async (req, res) => {
  const series = await Series.findById(req.params.id);
  res.render('series/show', { series });
});

// EDIT - Form to edit
app.get('/series/:id/edit', async (req, res) => {
  const series = await Series.findById(req.params.id);
  res.render('series/edit', { series });
});

// UPDATE
app.put('/series/:id', async (req, res) => {
  req.body.isCompleted = req.body.isCompleted === 'on';
  req.body.leadCharacters = req.body.leadCharacters.split(',').map(c => c.trim());
  await Series.findByIdAndUpdate(req.params.id, req.body);
  res.redirect(`/series/${req.params.id}`);
});

// DELETE
app.delete('/series/:id', async (req, res) => {
  await Series.findByIdAndDelete(req.params.id);
  res.redirect('/series');
});

app.set('view engine', 'ejs');
