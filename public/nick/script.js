async function fetchPokemonAbility() {
    const pokemonName = document.getElementById('pokemon').value.toLowerCase();  

    if (pokemonName) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
            const data = await response.json();

            if (data.abilities) {
                
                const firstAbility = data.abilities[0].ability.name;
                console.log(data.abilities); 

                const firstLetter = firstAbility.charAt(0);
                console.log(firstLetter)

                document.getElementById('result').textContent = ` ${pokemonName} uses ${firstAbility}!`;

                await fetchDogBreed(pokemonName, firstLetter);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            document.getElementById('result').textContent = 'Error fetching data. Please check the Pokémon name.';
        }
    }
}

async function fetchDogBreed(pokemonName, firstLetter) {
    try {
        
        const response = await fetch('https://dog.ceo/api/breeds/list/all');
        console.log(response);

        if (!response.ok) {
            throw new Error('Failed to fetch dog breeds');
        }

        const data = await response.json();
        const breeds = Object.keys(data.message); 
        const filteredBreeds = breeds.filter(breed => breed.charAt(0) === firstLetter);
        console.log(filteredBreeds);


        if (filteredBreeds.length > 0) {
            const randomBreed = filteredBreeds[Math.floor(Math.random() * filteredBreeds.length)];
            document.getElementById('dog-breed').textContent = `A wild ${randomBreed} appears!`;

            await generateImage(pokemonName, randomBreed);
        }
        else {
            document.getElementById('dog-breed').textContent = `No dog breed found for the letter '${firstLetter}'`;
        }
    } catch (error) {
        console.error('Error fetching dog breed:', error);
        document.getElementById('dog-breed').textContent = 'Error fetching dog breed. Please try again later.';
    }
}

async function generateImage(pokemonName, filteredBreed) {
    try {

        const response = await fetch('http://localhost:3000/generate-image', { 
            method: 'POST',  
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pokemonName, filteredBreeds: filteredBreed }),
        });

        const data = await response.json();

        if (data.imageUrl) {
            console.log(`Image received: ${data.imageUrl}`);
            document.getElementById('imageWinner').src = data.imageUrl;
        }
    } catch (error) {
    
        document.getElementById('imageWinner').textContent = 'Error generating image';
    }
}



document.getElementById('pokemonForm').addEventListener('submit', function(event) {
event.preventDefault(); 
fetchPokemonAbility();  
            
});