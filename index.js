const characters = document.getElementById("characters-container");
let characterList = [];
let favoriteCharacters = [];
let favouriteCharactersIds = [];


// Initialize favouriteCharacterIds from sessionStorage or an empty array
// Assuming favouriteCharacterIds is a string array
let favouriteCharacterIds = getFavouriteCharacterIds();

// Convert the string array into an integer array
let integerIds = favouriteCharacterIds.map((id) => parseInt(id, 10));

// Function to retrieve favouriteCharacterIds from sessionStorage
function getFavouriteCharacterIds() {
  const storageData = window.sessionStorage.getItem("favouriteCharactersIds");
  return storageData ? storageData.split(",") : [];
}

// Function to update the favouriteCharacterIds in sessionStorage
function updateFavouriteCharacterIds(ids) {
  window.sessionStorage.setItem("favouriteCharactersIds", ids.join(","));
}

// Function to show characters on the page
function showCharacters(charactersList) {
  const charactersContainer = document.getElementById("characters-container");
  charactersContainer.innerHTML = "";

  for (let i = 0; i < charactersList.length; i++) {
    const character = charactersList[i];

    // Create a new card div element
    const cardDiv = document.createElement("div");
    cardDiv.className = "card";
    cardDiv.style.width = "18rem";

    // Create an image element
    const img = document.createElement("img");
    img.className = "card-img-top";
    img.src = character.thumbnail.path + "." + character.thumbnail.extension;
    img.alt = "Character Image";

    // Create a card body div
    const cardBodyDiv = document.createElement("div");
    cardBodyDiv.className = "card-body";

    // Create card title
    const cardTitle = document.createElement("h5");
    cardTitle.className = "card-title";
    cardTitle.textContent = character.name;

    // Create card text (using the name of the first comic)
    const cardText = document.createElement("p");
    cardText.className = "card-text";
    if (character.comics.available > 0) {
      cardText.textContent = "Comic: " + character.comics.items[0].name;
    } else {
      cardText.textContent = "No comics available";
    }

    // Create card buttons container div
    const cardButtonsDiv = document.createElement("div");
    cardButtonsDiv.className = "card-buttons ";

    // Create "Add to Favorite" button
    const addToFavoriteButton = document.createElement("button");
    addToFavoriteButton.className = "btn btn-primary card-buttons";

    // Check if the character is already in favorites
    let isFavorite = integerIds.includes(character.id);

    if (isFavorite) {
      addToFavoriteButton.textContent = "Remove ";
    } else {
      addToFavoriteButton.textContent = "Add to Fav";
    }

    // Add an event listener for the "Add to Favorite" button click
    addToFavoriteButton.addEventListener("click", () => {
      const characterId = character.id;

      if (isFavorite) {
        // Remove the character ID from the favourites array
        favouriteCharacterIds = favouriteCharacterIds.filter(
          (id) => id !== characterId
        );
        addToFavoriteButton.textContent = "Add to Fav.";
      } else {
        // Add the character ID to the favourites array
        favouriteCharacterIds.push(characterId);
        addToFavoriteButton.textContent = "Remove ";
      }

      // Toggle the favourite status
      isFavorite = !isFavorite;

      // Update favouriteCharacterIds in sessionStorage
      updateFavouriteCharacterIds(favouriteCharacterIds);
    });

    // Create "Read More" button
    const readMoreButton = document.createElement("button");
    readMoreButton.className = "btn btn-secondary";
    readMoreButton.textContent = "Read.....";

    // Add an event listener for the "Read More" button click
    readMoreButton.addEventListener("click", () => {
      // Create a new URL with the character ID as a query parameter
      const characterDetailUrl = `./characterDetail.html?id=${character.id}`;

      // Redirect to the characterDetail.html page
      window.location.href = characterDetailUrl;
    });

    // Append buttons to the card buttons container
    cardButtonsDiv.appendChild(addToFavoriteButton);
    cardButtonsDiv.appendChild(readMoreButton);

    // Append elements to the card
    cardDiv.appendChild(img);
    cardDiv.appendChild(cardBodyDiv);
    cardBodyDiv.appendChild(cardTitle);
    cardBodyDiv.appendChild(cardText);
    cardBodyDiv.appendChild(cardButtonsDiv); // Append the buttons container to the card body

    // Append the card to the characters container
    charactersContainer.appendChild(cardDiv);
  }
}

// Function to get characters from the Marvel API
async function getCharacters() {
  const publicKey = "11702328d69ec88f25868e0a7dca81f3"; // Replace with your Marvel API public key
  const ts = Date.now().toString();
  const hash =
    "a77cc2deffc7f06f30a1c6d383dffd814e1feb3ffe1a2a6020a548456a9ab789403ae928"; // Replace with your Marvel API hash
  const limit = 20; // Number of characters to fetch

  const apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=1&apikey=11702328d69ec88f25868e0a7dca81f3&hash=fe1a2a6020a548456a9ab789403ae928`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.data && data.data.results) {
      return data.data.results;
    } else {
      console.error("Error fetching character data:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching character data:", error);
    return [];
  }
}

// Event listener for the form submit event (search)
const searchForm = document.querySelector("form[role='search']");
const searchInput = document.querySelector(".form-control");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = searchInput.value.trim();

  // Construct the API URL with the search query
  const publicKey = "YOUR_PUBLIC_KEY"; // Replace with your Marvel API public key
  const ts = Date.now().toString();
  const hash = "YOUR_HASH"; // Replace with your Marvel API hash
  const searchUrl = `https://gateway.marvel.com:443/v1/public/characters?nameStartsWith=${query}&ts=1&apikey=11702328d69ec88f25868e0a7dca81f3&hash=fe1a2a6020a548456a9ab789403ae928`;

  try {
    // Make an API request to retrieve the search results
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.data && data.data.results) {
      const searchResults = data.data.results;
    
      showCharacters(searchResults);
    } else {
      // Handle the case where no results are found
      alert("No results found for your search.");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

// Initial load of characters
getCharacters().then((data) => {
  characterList = data;
  showCharacters(characterList);
});
