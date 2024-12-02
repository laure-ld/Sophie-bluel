window.localStorage.setItem("token", "eyJhbGciOiJIUzI1NiIsInR...");
console.log("Token enregistré !");

//Creation modal
let modal = null 

const openModal = function(event){
    event.preventDefault()
    modal = document.querySelector(event.target.getAttribute("data-target"));
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.querySelector(".close").addEventListener("click", closeModal)
    modal.querySelector(".elementModal").addEventListener("click", stopPropagation)
}

const closeModal = function(event){
    if (modal === null) return
    event.preventDefault()
    modal.style.display = "none"
    modal.setAttribute("aria-hidden", "true")
    modal.querySelector(".close").removeEventListener("click", closeModal)
    modal.querySelector(".elementModal").removeEventListener("click", stopPropagation)
    modal = null
}
const stopPropagation = function (event) {
    event.stopPropagation()
}

document.querySelectorAll(".modify").forEach(attribut => {
    attribut.addEventListener("click", openModal)
})

window.addEventListener("keydown", function (event) {
    console.log("Touche pressée :", event.key);
     if (event.key === "Enter"){
        closeModal(event)
    }
})

//affichage projet miniature
const api = "http://localhost:5678/api"

async function getWorks(){
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

async function worksProject(){
    const allProject = await getWorks();
    if(allProject) {
        displayInProject(allProject);
    }
}
worksProject();

function displayInProject(projects2) {
    const container = document.querySelector("#portfolio .mini-project");
    
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

