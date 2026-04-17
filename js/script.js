// URL dell'API da cui recuperare i dati
const ApiURL = "https://lanciweb.github.io/demo/api/pictures/";
// Selezione dell'elemento HTML in cui inserire i dati recuperati
const photoListElement = document.getElementById("photo-list");

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