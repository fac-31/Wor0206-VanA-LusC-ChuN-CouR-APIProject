const express = require('express');
const browserSync = require('browser-sync');
const app = express();
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

console.log('Testing server...');

// Serve static files from the "public" directory
app.use(express.static('public'));
app.use(express.json());
app.use(cors()); // Allows frontend requests

// Define a route for the home page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Serve specific HTML files
app.get('/anna', (req, res) => {
  res.sendFile(__dirname + '/public/anna.html');
});

app.get('/christine', (req, res) => {
  res.sendFile(__dirname + '/public/christine.html');
});

app.get('/nick', (req, res) => {
  res.sendFile(__dirname + '/public/nick.html');
});

app.get('/rich', (req, res) => {
  res.sendFile(__dirname + '/public/rich.html');
});

// Anna: API A - Route to fetch meal data
app.get("/api/meal", async (req, res) => {
    try {
        const mealName = req.query.name;
        if (!mealName) {
            return res.status(400).json({ error: "Meal name is required" });
        }

        // Fix template string issue
        const themealdbUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(mealName)}`;
        const themealdbResponse = await axios.get(themealdbUrl);

        if (!themealdbResponse.data.meals || themealdbResponse.data.meals.length === 0) {
            return res.status(404).json({ error: "Meal not found" });
        }

        const category = themealdbResponse.data.meals[0].strMeal;
        console.log("Meal found:", category);

        // Ensure API key is provided
        if (!process.env.SPOONACULAR_API_KEY) {
            return res.status(500).json({ error: "Missing Spoonacular API key" });
        }

        // Fix template string issue
        const spoonacularUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(category)}&apiKey=${process.env.SPOONACULAR_API_KEY}`;
        const spoonacularResponse = await axios.get(spoonacularUrl);

        // Ensure spoonacularResponse.data.results exists
        const imageUrl = spoonacularResponse.data.results?.length > 0 ? spoonacularResponse.data.results[0].image : null;

        res.json({ mealName: category, imageUrl });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Initialize BrowserSync (only for development)
if (process.env.NODE_ENV !== 'production') {
  browserSync.init({
    proxy: `http://localhost:${PORT}`,
    files: ['public/**/*.*'], // Watch for changes in the 'public' folder
    reloadDelay: 50,
  });
}
