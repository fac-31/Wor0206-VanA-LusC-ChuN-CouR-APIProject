// Ageify API
const getAgeBasedOnName = async (name) => {
  try {
    const ageifyURI = `https://api.agify.io?name=${name}`;
    const response = await fetch(ageifyURI);
    const data = await response.json();
    const predictedAge = document.getElementById('agePrediction');
    console.log(data);
    predictedAge.textContent = `Ageify.io predicts that a person named ${name} would be ${data.age} years old.`;
    predictedAge.style.display = 'block';
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Form submit button
document
  .getElementById('nameForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const prediction = await getAgeBasedOnName(name);

    try {
      const response = await fetch(
        `http://localhost:3001/api/openai?name=${prediction.name}&age=${prediction.age}`
      );
      const data = await response.json();
      const imageUrl = data.imageUrl;

      const aiImage = document.getElementById('aiImage');
      aiImage.src = imageUrl;
      aiImage.alt = 'DALL-E generated image of a person';
    } catch (error) {
      console.error('Error fetching AI image:', error);
    }
  });
