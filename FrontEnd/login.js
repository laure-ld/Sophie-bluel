//appel API utilisateur 
const apiLog = "http://localhost:5678/api/users/login"

async function login(email, password) {
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

    if (email === emailOk && password === passwordOk) {
        try {
            const response = await login(email, password);

            if(response.token) {
                window.localStorage.setItem("token", response.token);
                window.location.href = "connected.html";
            } else{
                console.error("Aucun token retourné par l'API.");
            }

        } catch(error) {
            console.error("Erreur lors de la connexion :", error);
        }
    } else{
        console.error("Email ou mot de passe incorrect.");
        alert("Email ou mot de passe incorrect.");
    }
}