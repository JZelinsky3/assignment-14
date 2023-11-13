document.addEventListener('DOMContentLoaded', init);

async function init() {
    try {
        const movies = await fetchMovies();
        displayMovies(movies);
    } catch (error) {
        console.error('Error fetching movies:', error);
        showErrorMessage('Failed to fetch movies. Please try again later.');
    }
}

async function fetchMovies() {
    const response = await fetch('http://localhost:3000/');
    return response.json();
}

function displayMovies(movies) {
    const movieContainer = document.getElementById('movieContainer');
    movieContainer.innerHTML = '';

    movies.forEach((movie) => {
        const movieElement = createMovieElement(movie);
        movieContainer.appendChild(movieElement);
    });
}

function createMovieElement(movie) {
    const movieElement = document.createElement('div');
    movieElement.className = 'movie';
    movieElement.innerHTML = `
        <h3>${movie.title}</h3>
        <p>Genre: ${movie.genre}</p>
        <p>Year: ${movie.year}</p>
        <p>Actors: ${movie.actors.join(', ')}</p>
        <p>Director: ${movie.director}</p>
        <p>Rating: ${movie.rating}</p>
        <p>Quotes: ${movie.quotes ? movie.quotes.join(', ') : 'N/A'}</p>
    `;
    return movieElement;
}

function toggleForm() {
    const form = document.getElementById('addMovieForm');
    form.classList.toggle('hidden');
}

async function addMovie(event) {
    event.preventDefault();

    const form = document.getElementById('movieForm');
    const formData = new FormData(form);

    const actors = formData.get('actors').split(',').map(actor => actor.trim());

    const movieData = {
        title: formData.get('title'),
        genre: formData.get('genre'),
        year: formData.get('year'),
        actors: actors,
        director: formData.get('director'),
        rating: formData.get('rating'),
        quotes: formData.get('quotes') ? formData.get('quotes').split(',').map(quote => quote.trim()) : [],
    };

    try {
        const response = await fetch('http://localhost:3000/add-movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData),
        });

        if (response.ok) {
            const result = await response.json();
            showSuccessMessage(result.message);
            const updatedMovies = await fetchMovies();
            displayMovies(updatedMovies);
        } else {
            const result = await response.json();
            showErrorMessage(result.error || `Failed to add movie (HTTP ${response.status})`);
        }
    } catch (error) {
        console.error('Error:', error);
        showErrorMessage('An unexpected error occurred.');
    }
}

function showSuccessMessage(message) {
    const successMessage = document.getElementById('successMessage');
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 3000);
}

function showErrorMessage(error) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = error;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 3000);
}
