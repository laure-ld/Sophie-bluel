const token = window.localStorage.getItem("token");
console.log("Token récupere :", token)
 
//access to the modal
let modal = null 

const openModal = function(event) {
    event.preventDefault()
    modal = document.querySelector(event.target.getAttribute("data-target"));
    modal.style.display = null
    modal.addEventListener("click", closeModal);
    modal.removeAttribute("aria-hidden")
    modal.querySelectorAll(".close").forEach(btn => {
        btn.addEventListener("click", closeModal); });
    modal.querySelector(".modal-gallery").addEventListener("click", stopPropagation)
    modal.querySelector(".modal-add-photo").addEventListener("click", stopPropagation)
    const returnButton = modal.querySelector(".return");
    if (returnButton) {
        returnButton.addEventListener("click", showElementModal);
    }
    showElementModal()
}

const closeModal = function(event) {
    if (modal === null) return
    event.preventDefault()
    modal.style.display = "none"
    modal.removeEventListener("click", closeModal);
    modal.setAttribute("aria-hidden", "true")
    modal.querySelectorAll(".close").forEach(btn => {
        btn.removeEventListener("click", closeModal)});
    modal.querySelector(".modal-gallery").removeEventListener("click", stopPropagation)
    modal.querySelector(".modal-add-photo").removeEventListener("click", stopPropagation)
    const returnButton = modal.querySelector(".return");
    if (returnButton) {
        returnButton.removeEventListener("click", showElementModal);
    }
    modal = null;
};

const stopPropagation = function(event) {
    event.stopPropagation()
}

const showElementModal = function() {
    const elementModal = modal.querySelector(".modal-gallery");
    const addProject = modal.querySelector(".modal-add-photo");
    elementModal.style.display = "block";
    addProject.style.display = "none";
};

const showAddProject = function() {
    const elementModal = modal.querySelector(".modal-gallery");
    const addProject = modal.querySelector(".modal-add-photo");
    elementModal.style.display = "none";
    addProject.style.display = "block";
};

document.querySelectorAll(".modify").forEach(attribut => {
    attribut.addEventListener("click", openModal)
});

document.querySelector(".more").addEventListener("click", (event) => {
    event.preventDefault();
    showAddProject();
});

//displaying projects in thumbnail
const api = "http://localhost:5678/api"

async function getWorks() {
    try{
        const response = await fetch(api + "/works", {
            method:"GET", 
            headers: {
                "content-type": "application/json",
            }    
        }); 
    if(!response.ok){
        throw new Error ("Erreur lors de la récupération des projets");
    }

    const works = await response.json();
    return works;
    
} catch(error){
        console.error("Erreur lors de l’appel API :", error);
    }
}

function renderProjectsInModal(projects2) {
    const container = document.querySelector("#portfolio .modal-project-list");
    
    container.innerHTML = "";
    projects2.forEach(project => {
        const title = project.title
        const imageUrl = project.imageUrl
        
        const projectElement = document.createElement("div");
        projectElement.classList.add("projects2");

        projectElement.innerHTML = `
            <img src="${imageUrl}" alt="${title} image">
        `;
        container.appendChild(projectElement);
    });
}

async function worksProject(){
    const allProject = await getWorks();
    if(allProject) {
        renderProjectsInModal(allProject);
    }
}
worksProject();

//deletion of projects
document.addEventListener("DOMContentLoaded", () => {
    getWorks().then(projects => {
        if (projects && projects.length > 0) {
            renderProjectsWithDelete(projects);
        } else {
            console.error("Aucun projet récupéré ou liste vide !");
        }
    });
});

const renderProjectsWithDelete = function(projects) {
    const container = document.querySelector(".modal-project-list");
    container.innerHTML="";

    projects.forEach((project) => {
        const projectElement = document.createElement("div");
        projectElement.classList.add("project-item");
        projectElement.id = `projectModal-${project.id}`;

        const projectImage = document.createElement("img");
        projectImage.src = project.imageUrl 
        projectImage.alt = project.title


        const bin = document.createElement("button");
        bin.classList.add("delete-btn");        
        bin.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        projectElement.appendChild(projectImage);
        projectElement.appendChild(bin);
        container.appendChild(projectElement);
        btnAction(bin, project);
})
}

const btnAction = function(bin, project) {

    bin.addEventListener("click", async () => {
        const confirmation = confirm(`Voulez-vous vraiment supprimer le projet ${project.title} ?`);
        if (confirmation) {
            const isDeleted = await handleDeleteProject(project.id);
            if (isDeleted) {
                const galleryModal = document.querySelector(".modal-project-list");
                const gallery = document.querySelector(".gallery");
                removeProjectFromGallery(project.id, galleryModal, gallery);
            }
        }
    }); 
};

function removeProjectFromGallery(projectId) {
    const projectModalElement = document.querySelector(`#projectModal-${projectId}`);
    const projectGalleryElement = document.querySelector(`#project-${projectId}`);
    
    if (projectModalElement) {
        projectModalElement.remove();
    } else {
        console.error(`Impossible de trouver le projet avec l'ID projectModal-${projectId}`);
    }

    if (projectGalleryElement) {
        projectGalleryElement.remove();
    } else {
        console.error(`Impossible de trouver le projet avec l'ID project-${projectId}`);
    }
}

const authToken = token
async function handleDeleteProject(projectId) {
    try {
        const responseBin = await fetch (api + `/works/${projectId}`,{
            method:"DELETE", 
            headers: { 
                "Authorization": `Basic ${authToken}`,
                "content-type": "application/json",
             }   
        });
        
        if (responseBin.ok && (responseBin.status === 204 || responseBin.status === 200)) {
            console.log("Projet supprimé avec succès !");
            return true;

        } else {
            console.error(`Erreur inattendue : ${responseBin.status}`);
            return false;
        }

    } catch (error) {
        console.error("Erreur lors de l’appel API :", error);
        return false 
}}

//add new project
const form = document.querySelector(".upload-form");
const gallery = document.querySelector(".gallery");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    try {
        const response = await fetch (api + `/works`,{
            method:"POST",
            headers: {
                "Authorization": `Bearer ${authToken}`,
            },
            body: formData,  
        });
        
        if (response.ok && response.status === 201) {
            const newProject = await response.json();
            addToGallery(newProject);
        } else {
            console.error(`Erreur inattendue : ${response.status}`);
        }

    } catch (error) {
        console.error("Erreur lors de l’appel API :", error);
        return false 
    }
});

function addToGallery(project) {
    const projectElement = document.createElement("div");
    projectElement.classList.add("project-item");
    projectElement.innerHTML = `
        <img src="${project.imageUrl}" alt="${project.title}">
    `;
    gallery.appendChild(projectElement);
}

const categoryChoose = async function() { 
    try {
        const response = await fetch (api + "/categories", {
            method : "GET",
            headers : {
                "Content-Type": "application/json", },
        })

        if(!response.ok){
            console.error("error")
        }

        const categories = await response.json();
        const categoryDropdown = document.querySelector("#category");

        if (!categoryDropdown) {
            console.error("Menu déroulant non trouvé !");
            return;
        }
        categoryDropdown.innerHTML = "";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Sélectionnez une catégorie";
        categoryDropdown.appendChild(defaultOption);

        categories.forEach((category) => {
            const option = document.createElement("option");
            option.value = category.id; 
            option.textContent = category.name; 
            categoryDropdown.appendChild(option);
        });
        console.log("Catégories chargées avec succès !");
    }catch (error) {
        console.error("Erreur lors de la récupération des catégories :", error);
    }
};
document.addEventListener("DOMContentLoaded", categoryChoose);

document.addEventListener("DOMContentLoaded", () =>{
    const form = document.querySelector(".upload-form")
    const btnValid = document.querySelector(".Valid")
    const requiredFields = form.querySelectorAll("[required]")

    function checkFormCompletion() {
        const allFieldsFilled = Array.from(requiredFields).every(field => {
            if (field.type === "file") {
                return field.files.length > 0;
            }
            return field.value.trim() !== "";
        });

        if (allFieldsFilled) {
            btnValid.classList.add("active");
        } else {
            btnValid.classList.remove("active");
        }
    }
    requiredFields.forEach(field => {
        field.addEventListener("input", checkFormCompletion); 
        field.addEventListener("change", checkFormCompletion); 
    });
})  