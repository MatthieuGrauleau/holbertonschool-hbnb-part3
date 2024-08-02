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

	const placeName = document.createElement('h1');
	placeName.textContent = place.id || 'Name unavailable';

	const placeHost = document.createElement('p');
	placeHost.textContent = `Host: ${place.host_name || 'Host unavailable'}`;

	const placePrice = document.createElement('p');
	placePrice.textContent = `Price per night: $${place.price_per_night || 'Host unavailable'}`;

	const placeDescription = document.createElement('p');
	placeDescription.textContent = `Description: ${place.description || 'description unavailable'}`
	
	const placeLocation = document.createElement('p');
	placeLocation.textContent = `Location: ${place.city_name || 'City unavailable'}, ${place.country_name || 'Country unavailable'}`;

	const placeAmenities = document.createElement('p');
	placeAmenities.textContent = `Amenities: ${place.amenities || 'Amenities unavailable'}`

	placeDetailsSection.appendChild(placeName);
	placeContainer.appendChild(placeHost);
	placeContainer.appendChild(placePrice);
	placeContainer.appendChild(placeLocation);
	placeContainer.appendChild(placeDescription);
	placeContainer.appendChild(placeAmenities);
	
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

