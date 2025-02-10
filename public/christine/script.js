const firstName = document.getElementById("first-name");
const predictedAge = document.getElementById("predicted-age-paragraph");
const numberFact = document.getElementById("number-fact-paragraph");
const nameGuess = document.getElementById("name-guess-paragraph");

document.getElementById("name-form").addEventListener("submit", () => {
  console.log(firstName.value);
  getAge(firstName.value);
});

async function getAge(name) {
  try {
    let response = await fetch(`https://api.agify.io?name=${name}`);
    response = await response.json();
    predictedAge.innerText = `According to Agify.io, a person named ${capitaliseFirstLetter(
      name
    )} is likely ${response.age} years old.`;
    predictedAge.classList.remove("hidden");
    getNumberFact(response.age);
  } catch (error) {
    console.error("First API call failed:", error);
  }
}

async function getNumberFact(num) {
  try {
    const response = await fetch(`http://numbersapi.com/${num}/trivia`);
    const data = await response.text();
    numberFact.innerText = `Fun fact! ${data}`;
    numberFact.classList.remove("hidden");
    console.log(data);
  } catch (error) {
    console.error("Second API call failed:", error);
  }
}

async function getNameBasedOnNumberFact(fact) {
  const apiKey = "api key here!";
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `Guess my name based on the following fact about my age: ${fact}`,
        },
      ],
    }),
  });
  console.log(response.json());
  const data = await response.json();
  nameGuess.innerText = `${data}`;
  nameGuess.classList.remove("hidden");
}

const capitaliseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
