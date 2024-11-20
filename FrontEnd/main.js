//retrieving jobs via the API

const apiUrl = "http://localhost:5678/api"

async function getWorks(){
    try{
        const response = await fetch(apiUrl + "/works", {
            method:"GET", 
            headers: {
                "content-type": "application/json",
            }
            
        }); 
    if(!response.ok){
        throw new Error ("Erreur lors de la récupération des projets");
    }

    displayProject(await response.json());
    
} catch(error){
        console.error("Erreur lors de l’appel API :", error);
    }
}
getWorks();

//displaying jobs in HTML

function displayProject(projects) {
    const container = document.querySelector("#portfolio .gallery");
    
    container.innerHTML = "";
    projects.forEach(project => {
        const title = project.title
        const imageUrl = project.imageUrl
        
        let categoryName

        const projectElement = document.createElement("div");
        projectElement.classList.add("project");

        projectElement.innerHTML = `
            <h3>${title}</h3>
            <img src="${imageUrl}" alt="${title} image">
        `;
        container.appendChild(projectElement);
    });
}

// category recovery in the API

async function categoryProject() {
    try{
        const reponseCategory = await fetch(apiUrl + "/categories", {
            method:"GET", 
            headers: {
                "content-type": "application/json",
            }
        });
         
    if(!reponseCategory.ok){
        console.error("erreur");
        return;
    }
    
    displayCatégorie(await reponseCategory.json());

    }catch(error){
        console.error("Erreur lors de l’appel API :", error);
    }  
}
categoryProject();

//display buttons in HTML

function displayCatégorie(Catégories, allProject){
    const container = document.querySelector(".btn-category");
    container.innerHTML = "";
    
    //all button
    const allButton = document.createElement("button");
    allButton.classList.add("cat-btn");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => displayProject(allProject));
    container.appendChild(allButton);

    //filtred Buttons
    const filtredCategory = new Set (Catégories);
        filtredCategory.forEach(cat=>{
            //const {id, name} = cat;
            const id = cat.id
            const name = cat.name
            
            const button = document.createElement("button");
            button.classList.add("cat-btn");
            button.textContent = name;
            button.dataset.id = id;

            button.addEventListener("click", () => {
                const newFiltred = allProject.filter(projet => {
                    if(projet.category.id === id){
                         newFiltred.push(projet);
                    }
                });
                displayProject(newFiltred);
            });
            container.appendChild(button);
        });     
        
}
 