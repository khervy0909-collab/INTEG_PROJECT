require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const NUTRITION_API_KEY = process.env.NUTRITION_API_KEY;
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

// Nutrition 
app.get('/api/nutrition', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Query parameter required' });

    const url = `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`;
    const response = await fetch(url, { headers: { 'X-Api-Key': NUTRITION_API_KEY } });
    const data = await response.json();

    if (!response.ok) return res.status(response.status).json({ error: data });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recipe search
app.get('/api/recipes', async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: 'Query parameter required' });

    const url = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&number=10&addRecipeInformation=true&apiKey=${SPOONACULAR_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) return res.status(response.status).json({ error: data });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recipe details
app.get('/api/recipe/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const url = `https://api.spoonacular.com/recipes/${id}/information?includeNutrition=true&apiKey=${SPOONACULAR_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) return res.status(response.status).json({ error: data });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});