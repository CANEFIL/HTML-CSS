import array from "./data.js";

const mainTitle = document.createElement("h1");
mainTitle.innerHTML = "Jsem největší fanoušek <br> Harryho Pottera";
mainTitle.classList.add("main-title")
document.body.prepend(mainTitle)

const filterInput = document.createElement("input");
filterInput.type = "text";
filterInput.placeholder = "Hledejte film podle názvu.."
filterInput.classList.add("filter")
document.body.append(filterInput)


const main = document.createElement("div");
main.classList.add("gallery");
document.body.appendChild(main);

function rendersMovies(filteredArray) {
    main.innerHTML = ""

    filteredArray.forEach(movie => {
    const container=document.createElement("div");
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

    container.appendChild(img);
    container.appendChild(title);
    container.appendChild(year);
    container.appendChild(desc);

    main.appendChild(container);
    });
}

filterInput.addEventListener("input", () =>{
    const query = filterInput.value.toLocaleLowerCase();

    const filtered = array.filter(movie => movie.title.toLocaleLowerCase().includes(query));
    rendersMovies(filtered)
})

rendersMovies(array);
