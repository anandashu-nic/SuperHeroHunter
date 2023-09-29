// Get the favorite character IDs from sessionStorage
const favoriteCharactersIdsString = window.sessionStorage.getItem(
  "favouriteCharactersIds"
);
const favoriteCharactersIds = favoriteCharactersIdsString
  ? favoriteCharactersIdsString.split(",")
  : [];

const favoriteCharacterDetail = [];

const favoriteContainer = document.getElementById(
  "favourite-characters-container"
);

async function getCharacterDetail(id) {
  const findCharacterByIdUrl = `https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=11702328d69ec88f25868e0a7dca81f3&hash=fe1a2a6020a548456a9ab789403ae928`;

  const response = await fetch(findCharacterByIdUrl);
  const data = await response.json();
  return data.data.results[0];
}

async function populateCharacterDetails() {
  for (let i = 0; i < favoriteCharactersIds.length; i++) {
    const characterId = favoriteCharactersIds[i];
    const characterDetail = await getCharacterDetail(characterId);

    // Create a new character card div element
    const characterCard = document.createElement("div");
    characterCard.className = "character-card";

    // Create an image element for the character
    const characterImage = document.createElement("img");
    characterImage.className = "character-image";
    characterImage.src =
      characterDetail.thumbnail.path +
      "." +
      characterDetail.thumbnail.extension;
    characterImage.alt = "Character Image";

    // Create a heading element for the character's name
    const characterName = document.createElement("h3");
    characterName.className = "character-name";
    characterName.textContent = characterDetail.name;

    // Create a "Read More" button associated with the character's ID
    const readMoreButton = document.createElement("button");
    readMoreButton.className = "read-more-button";
    readMoreButton.textContent = "Read More";
    // Set the character's ID as a data attribute on the button
    readMoreButton.dataset.characterId = characterId;

    // Add a click event listener to the "Read More" button
    readMoreButton.addEventListener("click", () => {
      // Redirect to the characterDetail.html page with the character's ID
      const characterDetailUrl = `./characterDetail.html?id=${characterId}`;
      window.location.href = characterDetailUrl;
    });

    // Append the elements to the character card
    characterCard.appendChild(characterImage);
    characterCard.appendChild(characterName);
    characterCard.appendChild(readMoreButton);

    // Append the character card to the favoriteContainer
    favoriteContainer.appendChild(characterCard);
  }
}

populateCharacterDetails();
