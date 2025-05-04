import { checkAuth } from "./login.js"

export async function showProfile() {
  const user = await checkAuth();
  if (!user) return;

  const container = document.createElement("div");
  container.classList.add("profile-box");

  container.innerHTML = `
    <h2>Váš profil</h2>
    <p><strong>Email:</strong> ${user.email}</p>
    <p><strong>ID:</strong> ${user.id}</p>
    <p><strong>Registrován:</strong> ${new Date(user.created_at).toLocaleString()}</p>
    <button id="back-btn">Zpět do galerie</button>
  `;

  document.body.innerHTML = "";
  document.body.appendChild(container);

  document.getElementById("back-btn").addEventListener("click", () => {
    location.reload(); // nebo volání showApp(), pokud je dostupné
  });
}
