// scripts.js

// Fonction pour extraire l'ID du lieu à partir de l'URL
function getPlaceIdFromURL() {
	const urlParams = new URLSearchParams(window.location.search);
	return urlParams.get('id'); // 'id' est le nom du paramètre dans l'URL
}

// Fonction pour vérifier l'authentification
function checkAuthentication() {
	const token = getCookie('token');
	const loginLink = document.getElementById('login-link');
	const logoutButton = document.getElementById('logout-button');
	const addReviewSection = document.getElementById('add-review');

	if (!token) {
		loginLink.style.display = 'block';
		logoutButton.style.display = 'none';
		addReviewSection.style.display = 'none';
	} else {
		loginLink.style.display = 'none';
		logoutButton.style.display = 'block';
		addReviewSection.style.display = 'block';
		return token;
	}
	return null;
}

// Fonction pour obtenir une valeur de cookie par son nom
function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}

// Fonction pour récupérer les détails du lieu
async function fetchPlaceDetails(token, placeId) {
	try {
		const response = await fetch(`http://localhost:5000/places/${placeId}`, {
			headers: {
				'Authorization': token ? `Bearer ${token}` : ''
			}
		});
		if (!response.ok) {
			throw new Error('Network response was not ok ' + response.statusText);
		}
		const data = await response.json();
		displayPlaceDetails(data);
	} catch (error) {
		console.error('There was a problem with the fetch operation:', error);
	}
}

// Fonction pour afficher les détails du lieu
function displayPlaceDetails(place) {
	const placeDetailsSection = document.getElementById('place-details');
	placeDetailsSection.innerHTML = '';

	const placeContainer = document.createElement('div');
	placeContainer.classList.add('place-container');

	// Création et ajout du nom du lieu
	const placeName = document.createElement('h1');
	placeName.textContent = place.id || 'Name unavailable';
	placeDetailsSection.appendChild(placeName);

	// Création et ajout du nom de l'hôte
	const placeHost = document.createElement('p');
	placeHost.innerHTML = `<strong>Host:</strong> ${place.host_name || 'Host unavailable'}`;
	placeContainer.appendChild(placeHost);

	// Création et ajout du prix par nuit
	const placePrice = document.createElement('p');
	placePrice.innerHTML = `<strong>Price per night:</strong> $${place.price_per_night || 'Price unavailable'}`;
	placeContainer.appendChild(placePrice);

	// Création et ajout de la description
	const placeDescription = document.createElement('p');
	placeDescription.innerHTML = `<strong>Description:</strong> ${place.description || 'Description unavailable'}`;
	placeContainer.appendChild(placeDescription);

	// Création et ajout de la localisation
	const placeLocation = document.createElement('p');
	placeLocation.innerHTML = `<strong>Location:</strong> ${place.city_name || 'City unavailable'}, ${place.country_name || 'Country unavailable'}`;
	placeContainer.appendChild(placeLocation);

	// Création et ajout des équipements
	const placeAmenities = document.createElement('p');
	placeAmenities.innerHTML = `<strong>Amenities:</strong> ${place.amenities || 'Amenities unavailable'}`;
	placeContainer.appendChild(placeAmenities);

	// Ajout du conteneur au conteneur principal
	placeDetailsSection.appendChild(placeContainer);
}


// Initialisation de la page
document.addEventListener('DOMContentLoaded', () => {
	const placeId = getPlaceIdFromURL();
	const token = checkAuthentication();

	if (placeId) {
		fetchPlaceDetails(token, placeId);
	}
});

