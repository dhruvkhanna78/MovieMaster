const genreMap = {
    action: '28',
    adventure: '12',
    animation: '16',
    comedy: '35',
    crime: '80',
    documentary: '99',
    drama: '18',
    family: '10751',
    fantasy: '14',
    history: '36',
    horror: '27',
    music: '10402',
    mystery: '9648',
    romance: '10749',
    science_fiction: '878',
    tv_movie: '10770',
    thriller: '53',
    war: '10752',
    western: '37'
  };
  
  
  const genreSelect = document.getElementById('genre');
  for (let genre in genreMap) {
    const option = document.createElement('option');
    option.value = genre;
    option.textContent = genre.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    genreSelect.appendChild(option);
  }
  
  const form = document.getElementById('recommendForm');
  const resultDiv = document.getElementById('result');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const selectedGenre = document.getElementById('genre').value;
    const genreId = genreMap[selectedGenre];
  
    resultDiv.innerHTML = ''; 
  
    if (!genreId) return;
  
    try {
      const BASE_URL = "https://moviemaster-o94s.onrender.com"; // change to localhost:8000 for dev

      const response = await fetch(`${BASE_URL}/recommend?genre=${selectedGenre}`);
      const data = await response.json();
  
      if (data.movies && data.movies.length > 0) {
        data.movies.forEach(movie => {
          const card = document.createElement('div');
          card.className = 'movie-card';
  
          card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title} poster" />
            <h3>${movie.title}</h3>
            <p>${movie.overview.slice(0, 120)}...</p>
            <p><strong>⭐ Rating:</strong> ${movie.rating}</p>
          `;
  
          resultDiv.appendChild(card);
        });
      } else {
        resultDiv.innerHTML = `<p>No movies found for this genre.</p>`;
      }
    } catch (error) {
      console.error(error);
      resultDiv.innerHTML = `<p>Failed to fetch movie recommendations.</p>`;
    }
  });

  const darkModeCheckbox = document.querySelector('#themeToggle');

  // Dark Mode
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    darkModeCheckbox.checked = true;
  }
  
  darkModeCheckbox.addEventListener("change", () => {
    if (darkModeCheckbox.checked) {
      document.body.classList.add("dark-mode");
      localStorage.setItem("darkMode", "true");
    } else {
      document.body.classList.remove("dark-mode");
      localStorage.setItem("darkMode", "false");
    }
  });  