const $app = document.getElementById("app");
const $observe = document.getElementById("observe");
const API = "https://rickandmortyapi.com/api/character/";
let isFirst = true;

window.addEventListener("unload", event => {
  sessionStorage.clear();
});

const getData = async api => {
  const response = await fetch(api);
  let json;
  if (response.ok) {
    json = await response.json();
  } else {
    json = {
      error: `HTTP-Error: ${response.status}`
    };
  }
  return json;
};

const loadData = async () => {
  const next_fetch = sessionStorage.getItem("next_fetch");
  let response;
  if (next_fetch == null && isFirst) {
    response = await getData(API);
    createNewElement(response);
    isFirst = false;
  } else if (next_fetch.length > 0) {
    response = await getData(next_fetch);
    createNewElement(response);
  } else {
    intersectionObserver.disconnect();
    let lastPage = document.createElement("h3");
    lastPage.textContent = "No hay más personajes...";
    $app.appendChild(lastPage);
  }
  if (response.error) {
    alert(
      `En este momento no podemos responder su petición! ${response.error}`
    );
  }
};

const createNewElement = response => {
  sessionStorage.setItem("next_fetch", response.info.next);
  const characters = response.results;
  let output = characters
    .map(character => {
      return `
  <article class="Card">
    <img src="${character.image}" />
    <h2>${character.name}<span>${character.species}</span></h2>
  </article>
`;
    })
    .join("");
  let newItem = document.createElement("section");
  newItem.classList.add("Items");
  newItem.innerHTML = output;
  $app.appendChild(newItem);
};

const intersectionObserver = new IntersectionObserver(
  entries => {
    if (entries[0].isIntersecting) {
      loadData();
    }
  },
  {
    rootMargin: "0px 0px 100% 0px"
  }
);

intersectionObserver.observe($observe);
