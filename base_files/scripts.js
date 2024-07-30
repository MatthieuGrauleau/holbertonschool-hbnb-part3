document.addEventListener('DOMContentLoaded', () => {
	const loginForm = document.getElementById('login-form');

	if (loginForm) {
			loginForm.addEventListener('submit', async (event) => {
					event.preventDefault();

					const email = document.getElementById('email').value;
					const password = document.getElementById('password').value;

					try {
							const response = await fetch('http://127.0.0.1:5000/login', {  // Remplacez '/login' par l'URL de votre API si nécessaire
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
									const errorData = await response.json();
									alert(`Login failed: ${errorData.msg}`);
							}
					} catch (error) {
							console.error('Error during login:', error);
							alert('An error occurred. Please try again later.');
					}
			});
	}
});
