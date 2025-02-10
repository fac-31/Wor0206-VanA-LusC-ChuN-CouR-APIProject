const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cors()); // allows frontend requests

// Anna: API A - Route to fetch meal data
app.get("/api/meal", async (req, res) => {
    try {
        const mealName = req.query.name;
        if (!mealName) {
            return res.status(400).json({ error: "Meal name is required" });
        }

        const themealdbUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(mealName)}`;
        const themealdbResponse = await axios.get(themealdbUrl);

        if (!themealdbResponse.data.meals || themealdbResponse.data.meals.length === 0) {
            return res.status(404).json({ error: "Meal not found" });
        }

        const category = themealdbResponse.data.meals[0].strMeal;
        console.log("Meal found:", category);

        // Anna: API B - Fetch meal image
        const spoonacularUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(category)}&apiKey=${process.env.SPOONACULAR_API_KEY}`;
        const spoonacularResponse = await axios.get(spoonacularUrl);

        const imageUrl = spoonacularResponse.data.results.length > 0 ? spoonacularResponse.data.results[0].image : null;

        res.json({ mealName: category, imageUrl });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
