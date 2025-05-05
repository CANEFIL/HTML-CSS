export function showMovieDetail(movie) {
    const existing = document.querySelector(".modal-overlay");
    if (existing) existing.remove();
  
    const overlay = document.createElement("div");
    overlay.classList.add("modal-overlay");
  
    const modal = document.createElement("div");
    modal.classList.add("modal");
  
    const title = document.createElement("h2");
    title.textContent = movie.title;
  
    const year = document.createElement("p");
    year.textContent = `Rok: ${movie.year}`;
  
    const img = document.createElement("img");
    img.src = movie.image;
    img.alt = movie.title;
  
    const desc = document.createElement("p");
    desc.textContent = movie.description;
  
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "Zavřít";
    closeBtn.classList.add("close-btn");
    closeBtn.addEventListener("click", () => {
      overlay.remove();
      document.body.classList.remove("modal-open"); // ✅ povolíme scroll
    });
  
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.remove();
        document.body.classList.remove("modal-open"); // ✅
      }
    });
  
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        overlay.remove();
        document.body.classList.remove("modal-open"); // ✅
      }
    });
  
    modal.append(img, title, year, desc, closeBtn);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  
    document.body.classList.add("modal-open"); // ✅ zakážeme scroll
  }
  