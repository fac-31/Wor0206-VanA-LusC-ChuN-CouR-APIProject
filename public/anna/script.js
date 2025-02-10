document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contactForm");
    const searchButton = document.getElementById("submit");

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        fetchMeal(); 
    });

    searchButton.addEventListener("click", fetchMeal);

    function fetchMeal() {
        let name = document.getElementById("name").value.trim();
        console.log("Name:", name);

        if (!name) {
            console.log("Please enter a meal name.");
            return;
        }

        let mealNameElement = document.getElementById("meal-name");
        let mealImageElement = document.getElementById("meal-image");
        let failedMealElement = document.getElementById("failed-meal");
        let failedImageElement = document.getElementById("failed-image");
        let recipeElement = document.getElementById("recipe"); // New element for recipe details

        // Reset the UI
        mealNameElement.innerText = "";
        mealImageElement.src = "";
        mealImageElement.style.display = "none";
        failedMealElement.innerText = "";
        failedImageElement.innerText = "";
        recipeElement.innerHTML = ""; // Clear previous recipe

        let url = `http://localhost:3000/api/meal?name=${encodeURIComponent(name)}`;
        console.log("Fetching meal from:", url);
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("API Response:", data);

                if (!data.mealName) {
                    throw new Error("No meal found!");
                }

                // Display meal name
                mealNameElement.innerText = `Tonight's dinner: ${data.mealName}`;

                // Display meal image if available
                if (data.imageUrl) {
                    mealImageElement.src = data.imageUrl;
                    mealImageElement.style.display = "block";
                } else {
                    failedImageElement.innerText = "No pictures available!";
                }

                // ✅ Check if OpenAI response exists before trying to use it
                let recipeText = null;
                if (data.response && data.response.choices && data.response.choices.length > 0 && data.response.choices[0].message) {
                    recipeText = data.response.choices[0].message.content;
                }

                if (recipeText) {
                    recipeElement.innerHTML = `<h3>Recipe:</h3><p>${recipeText.replace(/\n/g, "<br>")}</p>`;
                } else {
                    recipeElement.innerHTML = "<p>No recipe found.</p>";
                }
            })
            .catch(error => {
                console.error("Fetch Error:", error);
                failedMealElement.innerText = "Can't find a meal, try again!";
            });
    }
});
