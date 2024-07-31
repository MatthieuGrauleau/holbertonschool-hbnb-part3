// Vérification de l'authentification de l'utilisateur
function checkAuthentication() {
	const token = getCookie('token');
	const loginLink = document.getElementById('login-link');
	if (!token) {
			loginLink.style.display = 'block';
	} else {
			loginLink.style.display = 'none';
			fetchPlaces(token);
	}
}

function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) return parts.pop().split(';').shift();
	return null;
}

document.addEventListener('DOMContentLoaded', checkAuthentication);

// Récupération des données des lieux
async function fetchPlaces(token) {
	try {
			const response = await fetch('http://localhost:5000/places', {
					headers: {
							'Authorization': `Bearer ${token}`
					}
			});
			if (!response.ok) {
					throw new Error('Network response was not ok ' + response.statusText);
			}
			const data = await response.json();
			displayPlaces(data);
	} catch (error) {
			console.error('There was a problem with the fetch operation:', error);
	}
}

// Remplir la liste des lieux
function displayPlaces(places) {
	const placesList = document.getElementById('places-list');
	placesList.innerHTML = ''; // Clear current content
	places.forEach(place => {
			const placeElement = document.createElement('div');
			placeElement.className = 'place';
			
			// Assurez-vous que les propriétés existent avant de les utiliser
			const placeName = place.id || 'Name unavailable';
			const placePrice = place.price_per_night || 'Price unavailable';
			const placeCity = place.city_name || 'City not available';
			const placeCountry = place.country_name || 'Country not available';
			
			placeElement.innerHTML = `
					<h2>${placeName}</h2>
					<p>Price per night: $${placePrice}</p>
					<p class="location">Location: ${placeCity}, ${placeCountry}</p>
			`;
			placesList.appendChild(placeElement);
	});
}

// Implémentation du filtre côté client
document.getElementById('country-filter').addEventListener('change', (event) => {
	const selectedCountry = event.target.value;
	const places = document.querySelectorAll('.place');
	places.forEach(place => {
			const locationText = place.querySelector('.location').textContent;
			const placeCountry = locationText.split(', ')[1];
			if (selectedCountry === 'all' || placeCountry === selectedCountry) {
					place.style.display = 'block';
			} else {
					place.style.display = 'none';
			}
	});
});