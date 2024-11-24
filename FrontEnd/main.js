//Call the works api

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

    const works = await response.json();
    return works;
    
} catch(error){
        console.error("Erreur lors de l’appel API :", error);
    }
}

//display projects in HTML

async function worksProject(){
    const allProject = await getWorks();
    if(allProject){
        displayProject(allProject);
    }
}
worksProject();

//displaying jobs in HTML
function displayProject(projects) {
    const container = document.querySelector("#portfolio .gallery");
    
    container.innerHTML = "";
    projects.forEach(project => {
        const title = project.title
        const imageUrl = project.imageUrl
        
        const projectElement = document.createElement("div");
        projectElement.classList.add("project");

        projectElement.innerHTML = `
            <img src="${imageUrl}" alt="${title} image">
            <h3>${title}</h3>
        `;
        container.appendChild(projectElement);
    });
}

// category recovery in the API
async function categoryProject() {
    try{
        const works = await getWorks();
        const responseCategory = await fetch(apiUrl + "/categories", {
            method:"GET", 
            headers: {
                "content-type": "application/json",
            }
        });
         
    if(!responseCategory.ok){
        console.error("erreur");
        return;
    }
    
    //displayCatégorie(await reponseCategory.json());
    const categories = await responseCategory.json();
    displayCategorie(categories,works);

    }catch(error){
        console.error("Erreur lors de l’appel API :", error);
    } 
}
categoryProject();

//display buttons in HTML
function displayCategorie(Categories, allProject){
    const container = document.querySelector(".btn-category");
    container.innerHTML = "";
    console.log("allProject :", allProject);
    
    //all button
    const allButton = document.createElement("button");
    allButton.classList.add("cat-btn");
    allButton.textContent = "Tous";
    allButton.addEventListener("click", () => displayProject(allProject));
    container.appendChild(allButton);

    //filtred Buttons
    const filtredCategory = new Set (Categories);
        filtredCategory.forEach(cat=>{
            //const {id, name} = cat;
            const id = cat.id
            const name = cat.name
            
            const button = document.createElement("button");
            button.classList.add("cat-btn");
            button.textContent = name;
            button.dataset.id = id;

            button.addEventListener("click", () => {
                const newFiltred = allProject.filter(projet => projet.category.id === id);
                    //{if(projet.category.id === id){
                         //newFiltred(projet);}
                
                displayProject(newFiltred);
            });
            container.appendChild(button);
        });           
}
getWorks();