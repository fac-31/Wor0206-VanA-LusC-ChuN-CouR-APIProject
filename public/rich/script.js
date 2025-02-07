// Ageify API
const getAgeBasedOnName = async (name) => {
  try {
    const ageifyURI = `https://api.agify.io?name=${name}`;
    const response = await fetch(ageifyURI);
    const data = await response.json();
    console.log('DATAAAAAA: ', data);
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Dall-e API
const OPENAI_URL = 'https://api.openai.com/v1/images/generations';
const OPENAI_KEY = 'open ai key go here';
const getImageBasedOnAgeAndName = async (age, name) => {
  const prompt = `a picture of a person who is ${age} years old with a name tag on that says ${name}`;
  try {
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
    const data = await response.json();
    console.log(data.data[0].url);
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
