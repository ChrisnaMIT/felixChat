let token = null
const loginPage = document.querySelector('.login')
const chatPage = document.querySelector('.chat')
const containterLogin = document.querySelector('.containerLogin')
const containerChat =  document.querySelector('.containerChat')
const decoChat = document.querySelector('.decoChat')
const emojiButton = document.querySelector('.emojiButton')
const allEmoji = document.querySelector('.allEmoji')
const loading = document.querySelector('.loading')
const imageFelix = document.querySelector('.imageFelix')




let premierMessageIa = {
    author : "Felix",
    content : "Bonjour je suis l'IA"
}
//let premierMessageUser = {
    //author : "Jean-michel",
  //  content : "bonjour je suis jean-michel. Quel est la couleur du ciel ?",
//}
//let deuxiemeMessageIa = {
    //author : "Felix",
  //  content : "Quelle est ta question ?"
//}


emojiButton.addEventListener("click",(e) =>{
    allEmoji.classList.toggle('allEmoji');
    if (e.target.classList.contains('allEmoji')) {
        messages.value += e.target.textContent;
    }
});










let messages = [premierMessageIa]

async function login(username, password){ // async function login avec les paramètres username et password
    console.log(username, password)
    let params = { // les params sont :
        method: "POST", //la méthode : ici post
        headers: {      // les hearders avec le content-Type
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ // et le body avec JSON.stringify
            username: username, // et username et password
            password: password,
        })
    }

    return await fetch('https://felix.esdlyon.dev/login', params) // on attend la réponse avec return await fetch du lien login
        .then((response) =>  response.json())
        .then((json) =>  {

            return json.token // et on return le token json

        })
}


//----------------------------------------------------
function displayLoginForm(){            // function qui permet d'afficher les différents DOM

    loginPage.style.display = 'block'
    chatPage.style.display = 'none'         // différente page du DOM
    containerChat.style.display= 'none'
    loading.style.display = 'none'


    let username = document.querySelector('.username')
    let password = document.querySelector('.password')
    let loginButton = document.querySelector('.submitLogin')
    loginButton.addEventListener('click', ()=>{ // ajout d'un évènement lorsqu'on appuie sur le bouton loginbutton

        login(username.value, password.value).then((data) => { // On appel la function asynchrone login avec les valeurs de username et password lorsque la function login est réussi (la promesse) le code apres le then s'execute
            token = data //la  valeur de data est assigniée à la variable token, il contient donc le  jeton json
            displayChat() // la function display chat est appelée apres que l'authentifications soit réussi
            console.log(token)
        })
    })
}
//--------------------------------------------------------
function displayMessages(){                                     // function qui permet d'afficher les messages
    document.querySelector('.messages').innerHTML = ""       // on initialise le contenu messages à rien ""
    messages.forEach(message => {           // pour tous les messages =>

        divMessage = document.createElement('div')                               // on créer une div
        divMessage.classList.add('message')                                              // Ensuite dans cette div on ajoute une classe message
        let paragraphe = document.createElement('p')        // on créer un <p> qui se nomme paragraphe
        paragraphe.textContent = message.content                                         // le contenu du paragraphe sera le contenu du message
        divMessage.appendChild(paragraphe)                                               // dans ma div message on ajoute le paragraphe
        // <div class ="messages">
        //      <p> message.content = Contenu du message </p>
        //</div>

        if(message.author === "Felix")       // cette condition permet de savoir qui pale
        {
            divMessage.classList.add('felix')       // si c'est felix alors on ajoute a la div message felix
        }else{
            divMessage.classList.add('user')        // sinon on ajoute à la div message user

        }
        document.querySelector('.messages').appendChild(divMessage)         //permet d'ajouter à la div parent messages la div enfant divMessage qui est devenu <p> le contenu du msg
    })



}
//--------------------------------------------------------------------
function handlePrompt(){ // function qui permet à l'utilisateur de d'envoyer sa réponse
    let prompt = document.querySelector('.prompt')
    let submitButton = document.querySelector('.chatSubmit')



    submitButton.addEventListener('click', ()=>{ // on ajoute un évènement au bouton
        addMessageToMessagesArray({ // pour ajouter son son message dans la div message
            author : "user",
            content:prompt.value // on prend la value du prompt

        })


        displayMessages()  // on affiche le message
        prompt.value = '' // dès que le message est envoyer on supprime le contenu du prompt


        askIa(prompt.value).then((data) => { // ensuite on demande a l'IA de répondre
            console.log(data)
            addMessageToMessagesArray({ // on ajoute sa réponse dans le contenu des messages
                author : "Felix",
                content:data // ici on prend la data pour sa réponse
            })
            displayMessages() // ensuite on affiche les messages
        })
    })
}



//function englishMessage (){
    //buttonAnglais.addEventListener('click', () => {
       // console.log('message en anglais')
      //  displayMessages()

       // askIa(messageInEnglish).then((data) => {

           // addMessageToMessagesArray({
            //    author : "Felix",
            //    content: data
          //  })
           // displayMessages()
        //})
    //})
//}


//--------------------------------------------------------

async function askIa(prompt) // function qui permet a l'IA de répondre avec ASYNC
{
    let params = { // les paramètres
        method: "POST", // avec la méthode POST
        headers: { // les headers
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // on donne le token sous cette forme
        },
        body: JSON.stringify({ // le body
            prompt: prompt,
        })
    }


    loading.style.display = 'block'


    return await fetch('https://felix.esdlyon.dev/ollama', params) // on return await fetch pour que l'IA donne sa réponse
        .then(response => response.json())
        .then((json) => {

            console.log(json)
            loading.style.display = 'none'
            return json.message

        })

}






function addMessageToMessagesArray(message) // function qui permet d'affciher le msg envoyer
{
    messages.push(message) // pour envoyer le msg dans la div message
}

function displayChat(){ // la function qui permet d'afficher la page du chat
    chatPage.style.display = 'block' // on affiche la page du chat
    containerChat.style.display = 'block'
    loginPage.style.display = 'none' // et on cache la page du login
    containterLogin.style.display = 'none'

    displayMessages() // ensuite on appel la function qui permet d'afficher les messages
    handlePrompt() // et la function qui permet d'envoyer un msg
}




if(!token){ // si y a pas de token
    displayLoginForm() // on affiche la page pour se login
}else{ // sion
    displayChat() // on affiche la page du chat
    displayMessages() // et on affiche la page pour les messages
}












// pour interroger l'IA il faut :
//un token à stocker dans un header Authorization : "Bearer ${token}"
//un header application.json
//le corps de requete doit etre en json, avec une clé "prompt", donc :
// {
// "prompt": "ma question"
// }