// @ts-check
'use strict';

/**
 * @typedef {Object} Photo
 * @property {string} url
 * @property {string} title
 * @property {string} date
 * @property {boolean} [uploaded]
 */

const apiUrl = 'https://lanciweb.github.io/demo/api/pictures/';
const localStorageKey = 'uploadedPhotos';

const photoListElement = /** @type {HTMLElement | null} */ (
    document.getElementById('photo-list')
);

const photoForm = /** @type {HTMLFormElement | null} */ (
    document.getElementById('photo-form')
);

const titleInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById('photo-title')
);

const dateInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById('photo-date')
);

const fileInput = /** @type {HTMLInputElement | null} */ (
    document.getElementById('photo-file')
);

const thumbnailImage = /** @type {HTMLImageElement | null} */ (
    document.getElementById('thumbnail-image')
);

const thumbnailPlaceholder = /** @type {HTMLElement | null} */ (
    document.getElementById('thumbnail-placeholder')
);

const photoModal = /** @type {HTMLElement | null} */ (
    document.getElementById('photo-modal')
);

const modalImage = /** @type {HTMLImageElement | null} */ (
    document.getElementById('modal-image')
);

const modalCloseButton = /** @type {HTMLButtonElement | null} */ (
    document.getElementById('modal-close')
);

if (photoListElement !== null) {
    photoListElement.innerHTML = `<p class="loading-message">Caricamento...</p>`;
}

/**
 * Converte la data da YYYY-MM-DD a DD-MM-YYYY
 * @param {string} dateString
 * @returns {string}
 */
function formatDate(dateString) {
    const parts = dateString.split('-');

    if (parts.length !== 3) {
        return dateString;
    }

    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
}

/**
 * Recupera le foto salvate in localStorage
 * @returns {Photo[]}
 */
function getUploadedPhotos() {
    const savedPhotos = localStorage.getItem(localStorageKey);

    if (!savedPhotos) {
        return [];
    }

    try {
        /** @type {unknown} */
        const parsed = JSON.parse(savedPhotos);

        if (Array.isArray(parsed)) {
            return /** @type {Photo[]} */ (parsed);
        }

        return [];
    } catch (error) {
        console.error('Errore nel parsing delle foto salvate:', error);
        return [];
    }
}

/**
 * Salva le foto in localStorage
 * @param {Photo[]} photos
 */
function saveUploadedPhotos(photos) {
    localStorage.setItem(localStorageKey, JSON.stringify(photos));
}

/**
 * Rimuove una foto caricata dall'utente dal localStorage
 * @param {Photo} photoToRemove
 */
function removeUploadedPhoto(photoToRemove) {
    const savedPhotos = getUploadedPhotos();

    const updatedPhotos = savedPhotos.filter((photo) => {
        return !(
            photo.url === photoToRemove.url &&
            photo.title === photoToRemove.title &&
            photo.date === photoToRemove.date
        );
    });

    saveUploadedPhotos(updatedPhotos);
}

/**
 * Apre la modale con immagine
 * @param {string} imageUrl
 */
function openModal(imageUrl) {
    if (photoModal === null || modalImage === null) return;

    modalImage.src = imageUrl;
    photoModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Chiude la modale
 */
function closeModal() {
    if (photoModal === null || modalImage === null) return;

    photoModal.classList.add('hidden');
    modalImage.src = '';
    document.body.style.overflow = '';
}

/**
 * Mostra la thumbnail scelta nella form
 * @param {string} imageUrl
 */
function showThumbnail(imageUrl) {
    if (thumbnailImage === null || thumbnailPlaceholder === null) return;

    thumbnailImage.src = imageUrl;
    thumbnailImage.style.display = 'block';
    thumbnailPlaceholder.style.display = 'none';
}

/**
 * Resetta la thumbnail
 */
function resetThumbnail() {
    if (thumbnailImage === null || thumbnailPlaceholder === null) return;

    thumbnailImage.src = '';
    thumbnailImage.style.display = 'none';
    thumbnailPlaceholder.style.display = 'block';
}

/**
 * Crea una card foto
 * @param {Photo} photo
 * @returns {HTMLDivElement}
 */
function createCard(photo) {
    const card = document.createElement('div');
    card.classList.add('photo-card');

    const deleteButtonMarkup = photo.uploaded
        ? `<button class="delete-button" type="button" aria-label="Elimina foto">&times;</button>`
        : '';

    card.innerHTML = `
        ${deleteButtonMarkup}
        <img class="photo-pin" src="./img/pin.svg" alt="puntina">

        <div class="photo-image">
            <img src="${photo.url}" alt="${photo.title}">
            <div class="photo-overlay"></div>
        </div>

        <div class="photo-date">${photo.date}</div>
        <h2 class="photo-title">${photo.title}</h2>
    `;

    card.addEventListener('click', () => {
        openModal(photo.url);
    });

    if (photo.uploaded) {
        const deleteButton = /** @type {HTMLButtonElement | null} */ (
            card.querySelector('.delete-button')
        );

        if (deleteButton !== null) {
            deleteButton.addEventListener('click', (event) => {
                event.stopPropagation();

                const confirmDelete = confirm(`Vuoi eliminare "${photo.title}"?`);

                if (!confirmDelete) return;

                removeUploadedPhoto(photo);
                card.remove();
            });
        }
    }

    return card;
}

/**
 * Renderizza una lista di foto
 * @param {Photo[]} photos
 * @param {boolean} prepend
 */
function renderPhotos(photos, prepend = false) {
    if (photoListElement === null) return;

    photos.forEach((photo) => {
        const cardElement = createCard(photo);

        if (prepend) {
            photoListElement.prepend(cardElement);
        } else {
            photoListElement.appendChild(cardElement);
        }
    });
}

// Fetch delle foto API
fetch(apiUrl)
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Errore HTTP: ${response.status}`);
        }

        return response.json();
    })
    .then(
        /** @param {Photo[]} apiPhotos */
        (apiPhotos) => {
            if (photoListElement === null) return;

            photoListElement.innerHTML = '';

            const uploadedPhotos = getUploadedPhotos();

            renderPhotos(uploadedPhotos, true);
            renderPhotos(apiPhotos);
        }
    )
    .catch((error) => {
        console.error('Errore:', error);

        if (photoListElement !== null) {
            photoListElement.innerHTML = `<p class="error-message">Errore nel caricamento delle foto.</p>`;
        }
    })
    .finally(() => {
        console.log('Chiamata terminata');
    });

// Preview file scelto
if (fileInput !== null) {
    fileInput.addEventListener('change', () => {
        const file = fileInput.files?.[0];

        if (!file) {
            resetThumbnail();
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Seleziona un file immagine valido.');
            fileInput.value = '';
            resetThumbnail();
            return;
        }

        const reader = new FileReader();

        reader.addEventListener('load', () => {
            const result = reader.result;

            if (typeof result === 'string') {
                showThumbnail(result);
            }
        });

        reader.readAsDataURL(file);
    });
}

// Submit form upload
if (
    photoForm !== null &&
    titleInput !== null &&
    dateInput !== null &&
    fileInput !== null &&
    photoListElement !== null
) {
    photoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = titleInput.value.trim();
        const date = dateInput.value;
        const file = fileInput.files?.[0];

        if (!title || !date || !file) {
            alert('Compila tutti i campi e seleziona un’immagine.');
            return;
        }

        if (!file.type.startsWith('image/')) {
            alert('Seleziona un file immagine valido.');
            return;
        }

        const reader = new FileReader();

        reader.addEventListener('load', () => {
            const result = reader.result;

            if (typeof result !== 'string') {
                alert('Errore nella lettura del file.');
                return;
            }

            /** @type {Photo} */
            const newPhoto = {
                title: title,
                date: formatDate(date),
                url: result,
                uploaded: true
            };

            const savedPhotos = getUploadedPhotos();
            savedPhotos.unshift(newPhoto);
            saveUploadedPhotos(savedPhotos);

            const newCard = createCard(newPhoto);
            photoListElement.prepend(newCard);

            photoForm.reset();
            resetThumbnail();
        });

        reader.readAsDataURL(file);
    });
}

// Chiudi modale con bottone
if (modalCloseButton !== null) {
    modalCloseButton.addEventListener('click', closeModal);
}

// Chiudi modale cliccando sullo sfondo
if (photoModal !== null) {
    photoModal.addEventListener('click', (event) => {
        if (event.target === photoModal) {
            closeModal();
        }
    });
}