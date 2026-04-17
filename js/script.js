// URL dell'API da cui recuperare i dati
const ApiURL = "https://lanciweb.github.io/demo/api/pictures/";
// Selezione dell'elemento HTML in cui inserire i dati recuperati
const photoListElement = document.getElementById("photo-list");

// Funzione per creare una card
function createCard(photo) {
    const card = document.createElement("div");
    card.classList.add("photo-card");

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

// Chiamata fetch per recuperare i dati dall'API
fetch(ApiURL)
    .then((response) => { // Gestisce la risposta della chiamata fetch
        if (!response.ok) { // Controlla se la risposta è stata ricevuta correttamente
            throw new Error("Network response was not ok");
        }
        return response.json(); // Converte la risposta in formato JSON
    })
    .then((photos) => { // Gestisce i dati recuperati
        photoListElement.innerHTML = ""; // Pulisce il contenuto precedente
        photos.forEach((photo) => { // Itera su ogni foto e crea una card
            const cardElement = createCard(photo); // Crea una card per ogni foto
            photoListElement.appendChild(cardElement); // Aggiunge la card all'elemento HTML selezionato
        });
    })
    .catch((error) => { // Gestisce eventuali errori durante la chiamata fetch
        console.error("Errore:", error);
    })
    .finally(() => { // Esegue un'azione finale indipendentemente dal successo o fallimento della chiamata fetch
        console.log("Chiamata terminata");
    });