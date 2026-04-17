// URL dell'API da cui recuperare i dati
const ApiURL = "https://lanciweb.github.io/demo/api/pictures/";
// Selezione dell'elemento HTML in cui inserire i dati recuperati
const photoListElement = document.getElementById("photo-list");

// Funzione per creare una card
function createCard(photo) {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <img class="photo-pin" src="/img/pin.svg" alt="puntina">
        <div class="photo-image">
            <img src="${photo.url}" alt="${photo.title}">
        </div>
        <div class="photo-date">${photo.date}</div>
        <h2 class="photo-title">${photo.title}</h2>
    `;

    return card;
}

// Esempio di chiamata fetch per recuperare i dati dall'API
fetch(ApiURL)
    .then((response) => {
        console.log("Risposta grezza:", response);
        return response.json();
    })
    .then((data) => {
        console.log("Dati convertiti in JSON:", data);
    })
    .catch((error) => {
        console.error("Errore:", error);
    })
    .finally(() => {
        console.log("Chiamata terminata");
    });