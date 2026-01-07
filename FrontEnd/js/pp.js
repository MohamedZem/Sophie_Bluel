
// Retrieving works from  API

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
  displayWorksInModal(works);
}

getWorks();




// Display works

function displayWork(work) {
    
    const gallery = document.querySelector(".gallery");

    const figure = document.createElement("figure");
    figure.innerHTML = `<img src=${work.imageUrl} alt=${work.title}> <figcaption>${work.title}</figcaption>`;
    gallery.appendChild(figure);
}

// Recovery of categories

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

// Filtering by category

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

// Function to create buttons dynamically

function createCategoryButtons(categories) {
    const buttonsFilters = document.querySelector(".buttons-filters");
    buttonsFilters.innerHTML = "";

// Creation of button "All"  that is absent in the API categories

const btnAll = document.createElement("button");
// Add text
btnAll.innerHTML = "Tous";
// Creation of the class for CSS
btnAll.classList.add("btn-all");
// Event created on click
btnAll.addEventListener("click", function() { 
    filterByCategory (null)
});

buttonsFilters.appendChild(btnAll);

// Buttons of categories

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

/*** Admin login  ***/
 

const adminSession = document.querySelector(".editor-mode"); /* show edit mode */

/* Checking if the admin is logged in */
function isLoggedIn() {
    return !!localStorage.getItem("token");

    /* Displays the admin session */
} if (isLoggedIn()) {
    adminSession.style.display = "block";
     console.log("Admin connecté");
} 

/*/ logout */
function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}
const authLogin = document.getElementById("auth-login");

if (isLoggedIn()) {
  // Displays logout when admin is logged in
    authLogin.textContent = "logout";
    authLogin.addEventListener("click", logout);
    
} else { 
  // else displays login 
    authLogin.textContent = "login";
    authLogin.addEventListener("click", () => {
        window.location.href = "login.html";
        
    });
}

// Hide filter buttons
const token = localStorage.getItem("token");
if (token) {
  const filters = document.querySelector(".buttons-filters");
  if (filters) {
    filters.style.display = "none";
  }
}
// Display "edit" when admin is logged in
if (token) {
	const modify = document.querySelector(".modify");
	if (modify) {
		modify.style.display = "flex";
  }
}



 





