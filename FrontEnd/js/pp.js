
//Récupération des travaux via l'API

let works = [];

async function getWorks () {
  const url = "http://localhost:5678/api/works";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

   
  works = await response.json();
    console.log(works);
    for (let i = 0; i < works.length ; i++) {
        displayWork(works[i]);
    }
  } catch (error) {
    console.error(error.message);
  }
}

getWorks();

// afficher travaux

function displayWork(work) {
    
    const gallery = document.querySelector(".gallery");

    const figure = document.createElement("figure");
    figure.innerHTML = `<img src=${work.imageUrl} alt=${work.title}> <figcaption>${work.title}</figcaption>`;
    gallery.appendChild(figure);
}

//récupération des catégories

async function getCategories () {
  const url = "http://localhost:5678/api/categories";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const categories = await response.json();
    console.log(categories);
    createCategoryButtons(categories);

  } catch (error) {
    console.error(error.message);
  }
}

getCategories();

// filtrage par catégorie

function filterByCategory(categoryId) {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";

  let filteredWorks;

  if (categoryId === null) {
    filteredWorks = works;
  } else {
    filteredWorks = works.filter(work => work.categoryId === categoryId);
  }

  for (let i = 0; i < filteredWorks.length; i++) {
    displayWork(filteredWorks[i]);
  }
}

// Fonction pour créer les boutons dynamiquement

function createCategoryButtons(categories) {
    const buttonsFilters = document.querySelector(".buttons-filters");
    buttonsFilters.innerHTML = "";

// Création bouton "Tous" absent des categories des l'API

const btnAll = document.createElement("button");
//Ajout du texte
btnAll.innerHTML = "Tous";
// création de la class pour le CSS
btnAll.classList.add("btn-all");
//Création de l'évènement au clic 
btnAll.addEventListener("click", function() { 
    filterByCategory (null)
});

buttonsFilters.appendChild(btnAll);

// Boutons des catégories

for (let i = 0; i < categories.length; i++) {

  const category = categories[i];

  const button = document.createElement("button");
  button.innerHTML = category.name;
  button.classList.add("buttons");
  
  button.addEventListener("click", function () {
    filterByCategory(category.id);
  });

 buttonsFilters.appendChild(button);
}
}

/*** Connexion admin ***/
 

const adminSession = document.querySelector(".editor-mode"); /* affiche mode édition */

/* Savoir si l'admin est connecté */
function isLoggedIn() {
    return !!localStorage.getItem("token");

    /* affiche la session de l'admin */
} if (isLoggedIn()) {
    adminSession.style.display = "block";
     console.log("Admin connecté");
} 

/*/ déconnexion */
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
const authLogin = document.getElementById("auth-login");

if (isLoggedIn()) {
  // affiche logout lorsqu'admin connecté
    authLogin.textContent = "logout";
    authLogin.addEventListener("click", logout);
    
} else { 
  // sinon affiche login 
    authLogin.textContent = "login";
    authLogin.addEventListener("click", () => {
        window.location.href = "login.html";
        
    });
}

//Masquer les boutons filtres
const token = localStorage.getItem("token");
if (token) {
  const filters = document.querySelector(".buttons-filters");
  if (filters) {
    filters.style.display = "none";
  }
}
// afficher "modifier" quand admin connecté
if (token) {
	const modify = document.querySelector(".modify");
	if (modify) {
		modify.style.display = "flex";
  }
}
 





