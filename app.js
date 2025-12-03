console.log(`Hello boosties`);

//todo: get codes for mtg sets

async function getCodeData() {
  //not needed, so not currently called
  const response = await fetch(`https://api.magicthegathering.io/v1/sets`);
  console.log(response);
  const codeData = await response.json(); //parse response into JSON
  console.log(codeData);
  //loop to find each code in the array
  for (let i = 0; i < codeData.sets.length; i++) {
    console.log(codeData.sets[i].code); //codeData is the JSON, then you need to select the array and then each object [i] AND THEN the code.
  }
  return codeData;
}

// getCodeData(); this is not required as the API uses the standard set codes that users would know (redundant because mtg players are big nerds).

function concatinate(userCode) {
  const url = `https://api.magicthegathering.io/v1/sets/${userCode.setCode}/booster`; //This returns an error 400 D: WHY? Answer: Some of the sets are not currently working, for testing use LEA as this confirmed works
  console.log(url);
  return url;
}
// concatinate(userCode); I cannot call this here because it must await the user's submit, I can call it in the handlesubmit function

//TODO: grab users code and concatinate with the api url to recieve the specific set requested by user on submit
const form = document.getElementById(`userCode`);
form.addEventListener(`submit`, handleSubmit);
function handleSubmit(submitEvent) {
  submitEvent.preventDefault(); //stops code being put in URL of page
  //creating template object to store the code
  const formData = new FormData(form);
  const userCode = Object.fromEntries(formData);
  console.log(userCode.setCode);
  const url = concatinate(userCode);
  cardGen(url);
  return userCode.setCode;
}

//TODO: create a function that gives you a booster pack based on the set you want.
async function cardGen(url) {
  //this function's aim is to grab names of cards in your generated pack
  const response = await fetch(url);
  console.log(url);
  const boosterData = await response.json();
  console.log(boosterData); //parse into JSON
  //get name of each card from boosterData
  for (let i = 0; i < boosterData.cards.length; i++) {
    console.log(boosterData.cards[i].name);
    const cardName = boosterData.cards[i].name;
    //create divs and ps for name and img to go into
    const p = document.createElement("p");
    const div = document.createElement("div");
    p.textContent = `${cardName}`;
    //get img
    cardData = await fetchCardData(cardName);
    img = cardImg(cardData);
    //append everything into divs
    div.appendChild(p);
    div.appendChild(img);
    //append divs to booster section
    document.getElementById("booster").appendChild(div);
  }
}

async function fetchCardData(cardName) {
  const scryUrl = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(
    cardName
  )}`;
  const response = await fetch(scryUrl);
  const cardData = await response.json();
  console.log(cardData);
  return cardData;
}

//TODO: a function that uses the fetchCardData() to get the img for each card and display it
function cardImg(cardData) {
  let imgSrc = null;

  if (cardData.image_uris) {
    imgSrc = cardData.image_uris.normal;
  } else if (cardData.card_faces && cardData.card_faces[0].image_uris) {
    imgSrc = cardData.card_faces[0].image_uris.normal;
  } //cases because some cards have multiple faces and that means you have to go further into the object.

  const img = document.createElement("img");
  img.src = imgSrc;
  return img;
}

//TODO: give divs names and give imgs class names etc for styling.
