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

// Dall-e API
const getImageBasedOnAgeAndName = async (age, name) => {
  const OPENAI_URL = 'https://api.openai.com/v1/images/generations';
  const OPENAI_KEY = 'open ai key go here';
  const prompt = `a photo-realistic person who is ${age} years old called ${name}`;

  try {
    document.getElementById('gettingImage').style.display = 'block'; // Un-hide loading info
    const response = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1, // Number of images
        size: '1024x1024',
      }),
    });
    const imageData = await response.json();
    const imageUrl = imageData.data[0].url;
    console.log(imageUrl);
    const aiImage = document.getElementById('aiImage');
    aiImage.src = imageUrl;
    aiImage.alt = 'dall-e generated image of a person';
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
    const image = getImageBasedOnAgeAndName(prediction.age, prediction.name);
    console.log(image);
  });
