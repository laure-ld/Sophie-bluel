//appel API utilisateur 
const apiLog = "http://localhost:5678/api/users/login"

async function login() {
    try{
        const response = await fetch(apiLog, {
            method:"POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });

        if(!response.ok){
            throw new Error ("Erreur lors de la récupération des projets");
        }

        const log = await response.json();
        return log;
}catch(error){
    console.error("Erreur lors de l’appel API :", error);
}
}

const emailOk = "sophie.bluel@test.tld"
const passwordOk ="S0phie"

async function loginOk(){
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
   
    if(!email && !password){
        console.error("Veuillez renseigner votre email et mot de passe.");
        return;
    }

    if(email === emailOk && password === passwordOk){
        console.log("Connexion réussie !");
        window.location.href = "index.html";
    }else{
        console.error("Email ou mot de passe incorrect.")
        alert("Email ou mot de passe incorrect.")
    }  
}
