const express = require("express");
const browserSync = require("browser-sync");
const app = express();
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const { OpenAI } = require("openai");

const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static("public"));
app.use(express.json());
app.use(cors()); // allows frontend requests

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
console.log(process.env.OPENAI_API_KEY);

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

//NC - Image generation

app.post("/generate-image", async (req, res) => {
  const { pokemonName, filteredBreeds } = req.body;
  const prompt = `If a '${pokemonName}' and a '${filteredBreeds}' have a battle, generate a vs poster image. Make sure there is no text on the image.`;

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    res.json({ imageUrl: response.data[0].url });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Error generating image" });
  }
});

app.get("/rich", (req, res) => {
  res.sendFile(__dirname + "/public/rich");
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

app.get("/api/openai", async (req, res) => {
  // Dall-e API
  const name = req.query.name;
  const age = req.query.age;
  const getImageBasedOnAgeAndName = async (name, age) => {
    const OPENAI_URL = "https://api.openai.com/v1/images/generations";
    const OPENAI_KEY = process.env.OPENAI_KEY;
    const prompt = `a photo-realistic person who is ${age} years old called ${name}`;

    console.log("the prompt: ", prompt);
    try {
      // Call OpenAI API
      const response = await axios.post(
        OPENAI_URL,
        {
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const imageUrl = response.data.data[0].url;
      return imageUrl;
    } catch (error) {
      console.error("Error fetching image from OpenAI:", error);
      throw new Error("Error fetching image");
    }
  };

  try {
    const imageUrl = await getImageBasedOnAgeAndName(name, age);
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate image" });
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
