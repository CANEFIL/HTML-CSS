import array from "./data.js";
import { checkAuth } from "./login.js";

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

export function isInWishlist(title) {
  return wishlist.includes(title);
}

export function toggleWishlist(title) {
  if (wishlist.includes(title)) {
    wishlist = wishlist.filter(t => t !== title);
  } else {
    wishlist.push(title);
  }
  saveWishlist();
}

export function getWishlist() {
  return wishlist;
}

function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
  
  // ✅ Funkce pro zobrazení wishlistu
  export async function showWishlist() {
    const user = await checkAuth();
    if (!user) {
      alert("Musíš být přihlášený.");
      return;
    }
  
    document.body.innerHTML = "";
  
    const heading = document.createElement("h1");
    heading.textContent = "🎬 Můj wishlist";
    heading.classList.add("main-title");
  
    const backBtn = document.createElement("button");
    backBtn.textContent = "⬅️ Zpět do galerie";
    backBtn.addEventListener("click", () => location.reload());
  
    const container = document.createElement("div");
    container.classList.add("gallery");
  
    const wishlistMovies = array.filter(movie => wishlist.includes(movie.title));
  
    if (wishlistMovies.length === 0) {
      const msg = document.createElement("p");
      msg.textContent = "Wishlist je prázdný.";
      msg.style.textAlign = "center";
      container.appendChild(msg);
    } else {
      // Použij tvoji funkci z script.js nebo vlož přímo zde
      wishlistMovies.forEach((movie) => {
        const card = document.createElement("div");
        card.classList.add("card");
  
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
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Odebrat z wishlistu";
        removeBtn.classList.add("wishlist-btn");

        removeBtn.addEventListener("click", () => {
        toggleWishlist(movie.title);
        showWishlist();
});

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(year);
        card.appendChild(desc);
        card.appendChild(removeBtn);
  
        container.appendChild(card);
      });
    }
  
    document.body.append(heading, backBtn, container);
  }