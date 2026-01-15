const modal = document.getElementById("modal-admin");
const modifyBtn = document.querySelector(".modify");
const closeModalBtn = document.querySelector(".close-modal");

// Open modal
if (modifyBtn && modal) {
    modifyBtn.addEventListener("click", () => {
        displayWorksInModal(works);
        modal.classList.remove("hidden");
    });
}

// Close modal
if (closeModalBtn && modal) {
    closeModalBtn.addEventListener("click", () => {
        resetAddPhotoView();
        modal.classList.add("hidden");
    });
}

// Click outside the modal
if (modal) {
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            resetAddPhotoView();
            modal.classList.add("hidden");
        }
    });
}

const modalGallery = document.querySelector(".modal-gallery");
// Display photos in the modal
function displayWorksInModal(works) {
    modalGallery.innerHTML = "";

    works.forEach(work => {
        const item = document.createElement("div");
        item.classList.add("modal-item");

        const img = document.createElement("img");
        img.src = work.imageUrl;
        img.alt = work.title;

        const button = document.createElement("button");
        button.classList.add("delete-btn");
        button.dataset.id = work.id;

        const trash = document.createElement("i");
        trash.classList.add("fa-solid" , "fa-trash-can");

        button.appendChild(trash);
        item.appendChild(img);
        item.appendChild(button);
        
        modalGallery.appendChild(item);
    });

    addDeleteListeners();
}

// Delete photo
function addDeleteListeners() {
    const deleteButtons = document.querySelectorAll(".delete-btn");
    const iconDelete = document.querySelector(".fa-solid fa-trash-can")

    deleteButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            console.log("photo supprimée");
            const workId = btn.dataset.id;
            deleteWork(workId);
        });
      
    });
    
};

function deleteWork(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Erreur suppression");
        }

        // Delete photo from front side whitout reload
        works = works.filter(work => work.id != id);

        // MAJ UI
        document.querySelector(".gallery").innerHTML = "";
        works.forEach(displayWork);
        displayWorksInModal(works);
    })
    .catch(error => {
        console.error(error);
        alert("Erreur lors de la suppression");
    });
}

// Add photo

const addBtn = document.querySelector(".btn-add");
const galleryView = document.querySelector(".modal-gallery-view");
const addView = document.querySelector(".modal-add-view");
const backBtn = document.querySelector(".back-modal");
const modalTitle = document.querySelector(".modal-title");

addBtn.addEventListener("click", () => {
    galleryView.classList.add("hidden");
    addView.classList.remove("hidden");
    backBtn.classList.remove("hidden");
    modalTitle.textContent = "Ajout photo";
});

// Button back
backBtn.addEventListener("click", () => {
    resetAddPhotoView();
    addView.classList.add("hidden");
    galleryView.classList.remove("hidden");
    backBtn.classList.add("hidden");
    modalTitle.textContent = "Galerie photo";
    console.log("retour à la gallerie photo");
});

const categorySelect = document.getElementById("category");

// Load categories from API
async function loadCategories() {
    const res = await fetch("http://localhost:5678/api/categories");
    const categories = await res.json();

    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        categorySelect.appendChild(option);
    });
}

loadCategories();

// Function reset form
    function resetAddPhotoView() {
    form.reset();
    previewImg.src = "";
    previewContainer.classList.add("hidden");
    uploadZone.classList.remove("hidden");
    submitBtn.disabled = true;
    }

const form = document.getElementById("add-photo");
const imageInput = document.getElementById("image");
const titleInput = document.getElementById("title");
const submitBtn = document.querySelector(".btn-submit");

// Form validation
// Activate the button if everything is OK
function checkFormValidity() {
    submitBtn.disabled = !(
        imageInput.files.length &&
        titleInput.value.trim() &&
        categorySelect.value
    );
}

imageInput.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);

const uploadZone = document.getElementById("upload-zone");
const previewContainer = document.getElementById("preview-container");
const previewImg = document.getElementById("preview-img");

imageInput.addEventListener("change", () => {
    const file = imageInput.files[0];
    if (!file) return;

// Retrieves the name without the extension
const fileName = file.name.replace(/\.[^/.]+$/, "");

// Automatically fills in the title
titleInput.value = fileName;

// Preview Image
previewImg.src = URL.createObjectURL(file);
previewContainer.classList.remove("hidden");
uploadZone.classList.add("hidden");

checkFormValidity();
    });  

// Click on the preview to change the image
previewContainer.addEventListener("click", () => {
    imageInput.click();
    });

// Prevent the page from reloading
form.addEventListener("submit", async (e) => {
    e.preventDefault();

// Mandatory image security
if (!imageInput.files.length) {
    alert("Veuillez sélectionner une image");
    return;                                                                                 
    };

const formData = new FormData();
formData.append("image", imageInput.files[0]);
formData.append("title", titleInput.value);
formData.append("category", categorySelect.value);

// Add photo to API
const res = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
        },
    body: formData 
    });

if (!res.ok) {
    alert("Erreur ajout");
    return;
    };

const newWork = await res.json();

// MAJ front
works.push(newWork);
displayWork(newWork);
displayWorksInModal(works);

// Reset form
resetAddPhotoView();
// Back gallery
backBtn.click();
    });



