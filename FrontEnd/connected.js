const token = window.localStorage.getItem("token");
console.log("Token récupere :", token)
 
//access to the modal
let modal = null 

const openModal = function (event) {
    event.preventDefault()
    modal = document.querySelector(event.target.getAttribute("data-target"));
    modal.style.display = null
    modal.addEventListener("click", closeModal);
    modal.removeAttribute("aria-hidden")
    modal.querySelector(".close").addEventListener("click", closeModal)
    modal.querySelector(".modal-gallery").addEventListener("click", stopPropagation)
    showElementModal()
}

const closeModal = function (event) {
    if (modal === null) return
    event.preventDefault()
    modal.style.display = "none"
    modal.removeEventListener("click", closeModal);
    modal.setAttribute("aria-hidden", "true")
    modal.querySelector(".close").removeEventListener("click", closeModal)
    modal.querySelector(".modal-gallery").removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = function (event) {
    event.stopPropagation()
}

const showElementModal = function () {
    const elementModal = modal.querySelector(".modal-gallery");
    const addProject = modal.querySelector(".modal-add-photo");
    elementModal.style.display = "block";
    addProject.style.display = "none";
}

const showAddProject = function () {
    const elementModal = modal.querySelector(".modal-gallery");
    const addProject = modal.querySelector(".modal-add-photo");
    elementModal.style.display = "none";
    addProject.style.display = "block";
};

document.querySelectorAll(".modify").forEach(attribut => {
    attribut.addEventListener("click", openModal)
})

document.querySelector(".more").addEventListener("click", (event) => {
    event.preventDefault();
    showAddProject();
});

//displaying projects in thumbnail
const api = "http://localhost:5678/api"

async function getWorks () {
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

function displayInProject (projects2) {
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

//deletion of projects
document.addEventListener("DOMContentLoaded", () => {
    getWorks().then(projects => {
        if (projects && projects.length > 0) {
            btnBin(projects);
        } else {
            console.error("Aucun projet récupéré ou liste vide !");
        }
    });
});

function btnBin (projects) {
    const container = document.querySelector(".modal-project-list");

    if (!container) {
        return;
    }
    container.innerHTML = "";

    projects.forEach (project => {
        const id = project.id
        const imageUrl = project.imageUrl
        const title = project.title

        const bin = document.createElement("button");
        bin.classList.add("delete-btn");
        bin.innerHTML = `<i class="fa-solid fa-trash"></i>`;

        bin.addEventListener("click", async () => {
            const confirmation = confirm(`Voulez-vous vraiment supprimer le projet ${project.title} ?`);
            if (confirmation) {
                const isDeleted = await deleteProject(id);
                if (isDeleted) {
                    const projectElement = document.getElementById(`project-${id}`);
                    projectElement.remove();
                }
            }
        });

        const projectElement = document.createElement("div");
        projectElement.classList.add("project-item");
        projectElement.id = `project-${id}`;
        projectElement.innerHTML = ` <img src="${imageUrl}" alt="${title} image"> `;

        projectElement.appendChild(bin);
        container.appendChild(projectElement);
    });
}
const autToken = token
async function deleteProject(id) {
    try {
        const responseBin = await fetch (api + `/works/${id}`,{
            method:"DELETE", 
            headers: { 
                "content-type": "application/json",
                "Authorization": `Basic ${autToken}`,
             }   
        });
        
        if (responseBin.ok && responseBin.status === 204) {
            console.log("Projet supprimé avec succès !");
            return true; 

        } else {
            console.error(`Erreur inattendue : ${responseBin.status}`);
        }
        return false;

    } catch (error) {
        console.error("Erreur lors de l’appel API :", error);
        return false 
    }}

async function worksProject(){
    const allProject = await getWorks();
    if(allProject) {
        displayInProject(allProject);
    }
}
worksProject();