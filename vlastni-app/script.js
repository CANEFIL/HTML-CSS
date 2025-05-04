import { checkAuth, login, logout, register } from './login.js';
import array from "./data.js";

// ======= Pomocná proměnná =======
let currentMovies = []; // aktivně zobrazené filmy

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
});

// ======= Filtrování podle názvu =======
filterInput.addEventListener("input", () => {
  const query = filterInput.value.toLowerCase();
  const filtered = currentMovies.filter((movie) =>
    movie.title.toLowerCase().includes(query)
  );
  rendersMovies(filtered, main);
});

// ======= Funkce pro vykreslení filmů =======
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

    container.appendChild(img);
    container.appendChild(title);
    container.appendChild(year);
    container.appendChild(desc);
    container.appendChild(toggleBtn);

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

// ======= Zobrazit filmy podle sekce =======
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

// ======= Úvodní stránka (nepřihlášený) =======
function showLandingPage() {
  const title = document.createElement("h1");
  title.textContent = "Vítej v Harry Potter Galerii";
  title.classList.add("landing-title");

  const subtitle = document.createElement("p");
  subtitle.textContent = "Prohlížej si filmy po přihlášení nebo registraci.";
  subtitle.classList.add("landing-subtitle");

  const loginButton = document.createElement("button");
  loginButton.textContent = "Přihlásit se";
  loginButton.addEventListener("click", showLoginForm);

  const registerButton = document.createElement("button");
  registerButton.textContent = "Registrovat se";
  registerButton.addEventListener("click", showRegisterForm);

  document.body.append(title, subtitle, loginButton, registerButton);
}

// ======= Přihlašovací formulář =======
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

// ======= Registrační formulář =======
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

// ======= Po přihlášení: galerie & sekce =======
function showApp() {
  document.body.innerHTML = "";
  document.body.prepend(mainTitle, filterInput, logoutBtn);
  document.body.appendChild(main);

  createSectionNavigation();
  renderFilteredGallery("all");
}

// ======= Zamíchání filmů (Fisher–Yates) =======
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ======= Spuštění aplikace =======
async function init() {
  shuffleArray(array); // 🎲 zamíchej filmy při každém načtení

  const user = await checkAuth();
  if (user) {
    showApp();
  } else {
    showLandingPage();
  }
}

init();
