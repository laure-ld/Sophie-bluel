const url = "http://localhost:5678/api/works"

async function workProject(){
    try{
        const reponse = await fetch(url, {
            method:"GET", 
            headers: {
                "content-type": "application/json",
            }
        });

    if(!reponse.ok){
        throw new Error ("Erreur lors de la récupération des projets");
    }

    const Projects = await reponse.json();
    displayProject(Projects);
    
}
    catch(error){
        console.error("Erreur lors de l’appel API :", error);
    }
}
workProject();

function displayProject(projects) {
    const container = document.querySelector("#portfolio .gallery");

    
    container.innerHTML = "";
    projects.forEach(project => {
        const { title, imageUrl, category } = project;
        const categoryName = category ? category.name : "Non spécifié";

        const projectElement = document.createElement("div");
        projectElement.classList.add("project");
        projectElement.innerHTML = `
            <h3>${title}</h3>
            <img src="${imageUrl}" alt="${title} image">
            <p>Catégorie : ${categoryName}</p>
        `;
        container.appendChild(projectElement);
    });
}