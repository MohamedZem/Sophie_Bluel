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
    if (!modalGallery) return;
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

if (addBtn && galleryView && addView && backBtn && modalTitle) {
    addBtn.addEventListener("click", () => {
        galleryView.classList.add("hidden");
        addView.classList.remove("hidden");
        backBtn.classList.remove("hidden");
        modalTitle.textContent = "Ajout photo";
    });

    backBtn.addEventListener("click", () => {
        resetAddPhotoView();
        addView.classList.add("hidden");
        galleryView.classList.remove("hidden");
        backBtn.classList.add("hidden");
        modalTitle.textContent = "Galerie photo";
    });
}

const categorySelect = document.getElementById("category");

// Load categories from API
async function loadCategories() {
    if (!categorySelect) return;

    try {
        const res = await fetch("http://localhost:5678/api/categories");
        const categories = await res.json();

        categories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.id;
            option.textContent = cat.name;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Erreur chargement catégories", error);
    }
}

loadCategories();

// Function reset form
function resetAddPhotoView() {
    if (form) form.reset();
    if (previewImg) previewImg.src = "";
    if (previewContainer) previewContainer.classList.add("hidden");
    if (uploadZone) uploadZone.classList.remove("hidden");
    if (submitBtn) submitBtn.disabled = true;
}

const form = document.getElementById("add-photo");
const imageInput = document.getElementById("image");
const titleInput = document.getElementById("title");
const submitBtn = document.querySelector(".btn-submit");

// Form validation
// Activate the button if everything is OK
function checkFormValidity() {
    if (!imageInput || !titleInput || !categorySelect || !submitBtn) return;

    const file = imageInput.files[0];
    const imageValid = file ? validateImageFile(file).valid : false;
    submitBtn.disabled = !(imageValid && titleInput.value.trim() && categorySelect.value);
}

if (imageInput) imageInput.addEventListener("change", checkFormValidity);
if (titleInput) titleInput.addEventListener("input", checkFormValidity);
if (categorySelect) categorySelect.addEventListener("change", checkFormValidity);

const uploadZone = document.getElementById("upload-zone");
const previewContainer = document.getElementById("preview-container");
const previewImg = document.getElementById("preview-img");
const imageError = document.getElementById("image-error");

const MAX_IMAGE_SIZE = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

function validateImageFile(file) {
    if (!file) {
        return { valid: false, message: "Veuillez sélectionner une image." };
    }
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return { valid: false, message: "Format d'image invalide. Seuls jpg et png sont autorisés." };
    }
    if (file.size > MAX_IMAGE_SIZE) {
        return { valid: false, message: "Taille maximale 4 Mo. Choisissez une image plus légère." };
    }
    return { valid: true, message: "" };
}

function showImageError(message) {
    if (imageError) {
        imageError.textContent = message;
        imageError.classList.remove("hidden");
    } else {
        alert(message);
    }
}

function hideImageError() {
    if (imageError) {
        imageError.textContent = "";
        imageError.classList.add("hidden");
    }
}

function clearInvalidImage() {
    imageInput.value = "";
    previewImg.src = "";
    previewContainer.classList.add("hidden");
    uploadZone.classList.remove("hidden");
    submitBtn.disabled = true;
}

if (imageInput) {
    imageInput.addEventListener("change", () => {
        const file = imageInput.files[0];
        if (!file) {
            hideImageError();
            checkFormValidity();
            return;
        }

        const validation = validateImageFile(file);
        if (!validation.valid) {
            showImageError(validation.message);
            clearInvalidImage();
            return;
        }

        hideImageError();

        const fileName = file.name.replace(/\.[^/.]+$/, "");
        if (titleInput) titleInput.value = fileName;
        if (previewImg) previewImg.src = URL.createObjectURL(file);
        if (previewContainer) previewContainer.classList.remove("hidden");
        if (uploadZone) uploadZone.classList.add("hidden");

        checkFormValidity();
    });
}

// Click on the preview to change the image
if (previewContainer && imageInput) {
    previewContainer.addEventListener("click", () => {
        imageInput.click();
    });
}

// Prevent the page from reloading
if (form) {
    form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const file = imageInput.files[0];
    const validation = validateImageFile(file);
    if (!validation.valid) {
        showImageError(validation.message);
        return;
    }

    if (!titleInput.value.trim()) {
        alert("Veuillez saisir un titre pour l'image.");
        return;
    }

    if (!categorySelect.value) {
        alert("Veuillez sélectionner une catégorie.");
        return;
    }

    const formData = new FormData();
        formData.append("image", file);
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
        }

        const newWork = await res.json();

        // MAJ front
        works.push(newWork);
        displayWork(newWork);
        displayWorksInModal(works);

        // Reset form
        resetAddPhotoView();
        // Back gallery
        if (backBtn) backBtn.click();
    });
}


