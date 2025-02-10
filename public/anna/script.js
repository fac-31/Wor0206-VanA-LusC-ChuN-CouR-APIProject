document.getElementById("submit").addEventListener("click", function () {
    let name = document.getElementById("name").value;
    console.log("Name:", name);

    let url = `http://localhost:3000/api/meal?name=${encodeURIComponent(name)}`;

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

            document.getElementById("meal-name").innerText = `Tonight's dinner: ${data.mealName}`;

            if (data.imageUrl) {
                document.getElementById("meal-image").src = data.imageUrl;
                document.getElementById("meal-image").style.display = "block";
            } else {
                document.getElementById("failed-image").innerText = "No pictures available!";
            }
        })
        .catch(error => {
            console.error("Fetch Error:", error);
            document.getElementById("failed-image").innerText = "Failed to fetch data!";
        });
});
