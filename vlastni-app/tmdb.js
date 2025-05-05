// tmdb.js

const API_KEY = "4fa4287ac5a4f1d60b9a1493e266d88b";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

// Získání populárních filmů v češtině
export async function fetchPopularMovies() {
  try {
    const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=cs-CZ&page=1`);
    const data = await res.json();
    return data.results.map(film => ({
      title: film.title,
      year: film.release_date?.slice(0, 4),
      image: IMG_URL + film.poster_path,
      description: film.overview,
      section: "popular"
    }));
  } catch (err) {
    console.error("Chyba při načítání filmů z TMDb:", err);
    return [];
  }
}