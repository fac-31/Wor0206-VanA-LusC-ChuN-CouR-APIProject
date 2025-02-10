const firstName = document.getElementById("first-name");
const predictedAge = document.getElementById("predicted-age-paragraph");
const numberFact = document.getElementById("number-fact-paragraph");
const jokeParagraph = document.getElementById("joke-paragraph");

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
    getJokeBasedOnNumberFact(data);
  } catch (error) {
    console.error("Second API call failed:", error);
  }
}

async function getJokeBasedOnNumberFact(fact) {
  const apiKey = "api key here";
  try {
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
            content: `Tell me a joke based on the following fact: ${fact}`,
          },
        ],
      }),
    });
    const data = await response.json();
    jokeParagraph.innerText = `${data.choices[0].message.content}`;
    jokeParagraph.classList.remove("hidden");
  } catch (error) {
    console.error("Third API call failed:", error);
  }
}

const capitaliseFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
