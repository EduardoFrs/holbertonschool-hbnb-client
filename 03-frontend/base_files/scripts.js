// LOGIN IMPLEMENTATION //
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            await loginUser(email, password);
        });
    }

    checkAuthentication();
});

async function loginUser(email, password) {
    const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.ok) {
        const data = await response.json();
        document.cookie = `token=${data.access_token}; path=/`;
        window.location.href = 'index.html';
    } else {
        alert('Login failed: ' + response.statusText);
    }
}


// LIST OF PLACES IMPLEMENTATION //
function checkAuthentication() {
    const token = getCookie('token');
    const loginLink = document.getElementById('login-link');

    if (!token) {
        loginLink.style.display = 'block';
    } else {
        loginLink.style.display = 'none';
        // Fetch places data if the user is authenticated
        fetchPlaces(token);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchPlaces(token) {
    try {
        const response = await fetch('http://127.0.0.1:5000/places', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Fetched places:', data);
            displayPlaces(data);
        } else {
            console.error('Failed to fetch places:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching places:', error);
    }
}

function displayPlaces(places) {
    const placesList = document.getElementById('places-list');
    placesList.innerHTML = '';

    places.forEach(place => {
        const placeElement = document.createElement('div');
        placeElement.classList.add('place');

        placeElement.innerHTML = `
            <h3>${place.description}</h3>
            <p><strong>Price per night:</strong> $${place.price_per_night}</p>
            <p><strong>Location:</strong> ${place.city_name}, ${place.country_name}</p>
            <button class="details-button">View Details</button>
        `;
        placesList.appendChild(placeElement);
    });
}

// Implement client-side filtering
document.getElementById('country-filter').addEventListener('change', (event) => {
    const selectedCountry = event.target.value;
    const places = document.querySelectorAll('.place');

    places.forEach(place => {
        const countryName = place.querySelector('p:nth-of-type(3)').textContent.split(', ')[1];
        if (selectedCountry === 'all' || countryName === selectedCountry) {
            place.style.display = 'block';
        } else {
            place.style.display = 'none';
        }
    });
});
