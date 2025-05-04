import { checkAuth, login, logout, register } from './login.js';
import array from "./data.js";
import { showProfile } from "./profile.js";
import { isInWishlist, toggleWishlist, showWishlist } from "./wishlist.js";

// ======= Pomocné proměnné =======
let currentMovies = [];
let ratings = JSON.parse(localStorage.getItem("ratings")) || {};
function saveRatings() {
  localStorage.setItem("ratings", JSON.stringify(ratings));
}

// ======= HTML PRVKY =======
const main = document.createElement("div");
main.classList.add("gallery");

const mainTitle = document.createElement("h1");
mainTitle.textContent = "Galerie filmů";
mainTitle.classList.add("main-title");

const filterInput = document.createElement("input");
filterInput.type = "text";
filterInput.placeholder = "Hledejte film podle názvu..";
filterInput.classList.add("filter");

const logoutBtn = document.createElement("button");
logoutBtn.textContent = "Odhlásit se";
logoutBtn.addEventListener("click", async () => {
  await logout();
  location.reload();
});

const profileBtn = document.createElement("button");
profileBtn.textContent = "Můj profil";
profileBtn.addEventListener("click", showProfile);

const wishlistBtn = document.createElement("button");
wishlistBtn.textContent = "📃 Můj wishlist";
wishlistBtn.addEventListener("click", showWishlist);

// ======= Filtrování =======
filterInput.addEventListener("input", () => {
  const query = filterInput.value.toLowerCase();
  const filtered = currentMovies.filter((movie) =>
    movie.title.toLowerCase().includes(query)
  );
  rendersMovies(filtered, main);
});

// ======= Vykreslení filmů =======
function rendersMovies(movies, targetContainer) {
  targetContainer.innerHTML = "";
  movies.forEach((movie) => {
    const container = document.createElement("div");
    container.classList.add("card");

    const img = document.createElement("img");
    img.src = movie.image;
    img.classList.add("photo");

    const title = document.createElement("h2");
    title.textContent = movie.title;
    title.classList.add("title-text");

    const year = document.createElement("p");
    year.textContent = `Rok: ${movie.year}`;
    year.classList.add("year-text");

    const desc = document.createElement("p");
    desc.textContent = movie.description;
    desc.classList.add("description");

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Zobrazit více";
    toggleBtn.classList.add("toggle-description");

    toggleBtn.addEventListener("click", () => {
      desc.classList.toggle("expanded");
      toggleBtn.textContent = desc.classList.contains("expanded")
        ? "Zobrazit méně"
        : "Zobrazit více";
    });

    const wishlistToggleBtn = document.createElement("button");
    wishlistToggleBtn.textContent = isInWishlist(movie.title)
      ? "Odebrat z wishlistu"
      : "Přidat do wishlistu";
    wishlistToggleBtn.classList.add("wishlist-btn");

    wishlistToggleBtn.addEventListener("click", () => {
      toggleWishlist(movie.title);
      wishlistToggleBtn.textContent = isInWishlist(movie.title)
        ? "Odebrat z wishlistu"
        : "Přidat do wishlistu";
    });

    // ⭐ Hodnocení hvězdičkami (1–10)
    const ratingContainer = document.createElement("div");
    ratingContainer.classList.add("rating-stars");
    const userRating = ratings[movie.title] || 0;

    for (let i = 1; i <= 10; i++) {
      const star = document.createElement("span");
      star.textContent = i <= userRating ? "★" : "☆";
      star.classList.add("star");
      if (i <= userRating) star.classList.add("rated");

      star.addEventListener("click", () => {
        ratings[movie.title] = i;
        saveRatings();
        rendersMovies(currentMovies, main);
      });

      ratingContainer.appendChild(star);
    }

    container.appendChild(img);
    container.appendChild(title);
    container.appendChild(year);
    container.appendChild(desc);
    container.appendChild(toggleBtn);
    container.appendChild(wishlistToggleBtn);
    container.appendChild(ratingContainer);

    targetContainer.appendChild(container);
  });
}

// ======= Navigace sekcí =======
function createSectionNavigation() {
  const nav = document.createElement("div");
  nav.classList.add("section-nav");

  const buttons = [
    { label: "Všechny", key: "all" },
    { label: "Harry Potter", key: "harry" },
    { label: "Pán prstenů", key: "lotr" },
    { label: "Rychle a zběsile", key: "fast" },
  ];

  buttons.forEach(({ label, key }) => {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.classList.add("nav-button");

    btn.addEventListener("click", () => {
      renderFilteredGallery(key);
      document.querySelectorAll(".nav-button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });

    nav.appendChild(btn);
  });

  document.body.insertBefore(nav, main);
}

// ======= Filtrace podle sekce =======
function renderFilteredGallery(sectionKey) {
  const query = filterInput.value.toLowerCase();
  currentMovies = sectionKey === "all"
    ? array
    : array.filter(movie => movie.section === sectionKey);

  const filtered = currentMovies.filter((movie) =>
    movie.title.toLowerCase().includes(query)
  );

  rendersMovies(filtered, main);
}

// ======= Landing Page =======
function showLandingPage() {
  document.body.innerHTML = "";

  // ======= Hlavní sekce =======
  const hero = document.createElement("section");
  hero.classList.add("landing-hero");

  const title = document.createElement("h1");
  title.textContent = "🎬 Filmová galerie";
  title.classList.add("landing-title");

  const subtitle = document.createElement("p");
  subtitle.textContent = "Objev kouzelný svět filmů po přihlášení nebo registraci.";
  subtitle.classList.add("landing-subtitle");

  const buttons = document.createElement("div");
  buttons.classList.add("landing-buttons");

  const loginButton = document.createElement("button");
  loginButton.textContent = "Přihlásit se";
  loginButton.addEventListener("click", showLoginForm);

  const registerButton = document.createElement("button");
  registerButton.textContent = "Registrovat se";
  registerButton.addEventListener("click", showRegisterForm);

  buttons.append(loginButton, registerButton);
  hero.append(title, subtitle, buttons);

  //======= Náhled filmů =======
  const previewSection = document.createElement("section");
  previewSection.classList.add("landing-preview");

  const previewTitle = document.createElement("h2");
  previewTitle.textContent = "📺 Ukázka filmů";

  const previewGallery = document.createElement("div");
  previewGallery.classList.add("preview-gallery");

  const previewMovies = [...array];
  shuffleArray(previewMovies);
  previewMovies.slice(0, 4).forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("card");

    const img = document.createElement("img");
    img.src = movie.image;

    const name = document.createElement("h3");
    name.textContent = movie.title;

    card.append(img, name);
    previewGallery.appendChild(card);
  })
  previewSection.append(previewTitle,previewGallery);
  document.body.append(hero, previewSection)
}

// ======= Přihlášení =======
function showLoginForm() {
  document.body.innerHTML = "";
  const form = document.createElement("form");
  form.innerHTML = `
    <h2>Přihlášení</h2>
    <input type="email" id="login-email" placeholder="Zadej email" required />
    <input type="password" id="login-password" placeholder="Zadej heslo" required />
    <button type="submit">Přihlásit se</button>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
      await login(email, password);
      location.reload();
    } catch (err) {
      alert("Chyba: " + err.message);
    }
  });

  document.body.append(form);
}

// ======= Registrace =======
function showRegisterForm() {
  document.body.innerHTML = "";
  const form = document.createElement("form");
  form.innerHTML = `
    <h2>Registrace</h2>
    <input type="email" id="register-email" placeholder="Email" required />
    <input type="password" id="register-password" placeholder="Heslo (min. 6 znaků)" required />
    <button type="submit">Registrovat</button>
  `;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    try {
      await register(email, password);
      alert("Registrace proběhla. Zkontroluj email a poté se přihlas.");
      showLoginForm();
    } catch (err) {
      alert("Chyba při registraci: " + err.message);
    }
  });

  document.body.append(form);
}

// ======= Galerie pro přihlášeného uživatele =======
function showApp() {
  document.body.innerHTML = "";
  document.body.prepend(mainTitle, filterInput, logoutBtn, profileBtn, wishlistBtn);
  document.body.appendChild(main);

  createSectionNavigation();
  renderFilteredGallery("all");
}

// ======= Zamíchání filmů =======
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ======= Spuštění aplikace =======
async function init() {
  shuffleArray(array);
  const user = await checkAuth();
  if (user) {
    showApp();
  } else {
    showLandingPage();
  }
}

init();
