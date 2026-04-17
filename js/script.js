const loadButton = document.getElementById('loadButton');

const ApiURL = "https://lanciweb.github.io/demo/api/pictures/";

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