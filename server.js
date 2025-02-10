const express = require("express");
const browserSync = require("browser-sync");
const app = express();
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

console.log("teesting123");

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.json());
app.use(cors()); // allows frontend requests

// Define a route for the home page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/anna", (req, res) => {
  res.sendFile(__dirname + "/public/anna");
});

app.get("/christine", (req, res) => {
  res.sendFile(__dirname + "/public/christine");
});

app.get("/nick", (req, res) => {
  res.sendFile(__dirname + "/public/nick");
});

app.get("/rich", (req, res) => {
  res.sendFile(__dirname + "/public/rich");
});

const key = process.env.RICH_API_KEY;

app.get("/api/key", (req, res) => {
  res.json(key);
});

// Anna: API A - Route to fetch meal data
app.get("/api/meal", async (req, res) => {
  try {
    const mealName = req.query.name;
    if (!mealName) {
      return res.status(400).json({ error: "Meal name is required" });
    }

    const themealdbUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
      mealName
    )}`;
    const themealdbResponse = await axios.get(themealdbUrl);

    if (
      !themealdbResponse.data.meals ||
      themealdbResponse.data.meals.length === 0
    ) {
      return res.status(404).json({ error: "Meal not found" });
    }

    const category = themealdbResponse.data.meals[0].strMeal;
    console.log("Meal found:", category);

    // Anna: API B - Fetch meal image
    const spoonacularUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(
      category
    )}&apiKey=${process.env.SPOONACULAR_API_KEY}`;
    const spoonacularResponse = await axios.get(spoonacularUrl);

    const imageUrl =
      spoonacularResponse.data.results.length > 0
        ? spoonacularResponse.data.results[0].image
        : null;

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

// Initialize BrowserSync
browserSync.init({
  proxy: `http://localhost:${PORT}`,
  files: ["public/**/*.*"], // Watch for changes in the 'public' folder
  reloadDelay: 50,
});
