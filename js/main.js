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



let messageInEnglish = {
    author : "Felix",
    content : "We can speak in English now"
}








let messages = [premierMessageIa]
async function login(username, password){
    console.log(username, password)
    let params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password,
        })
    }

    return await fetch('https://felix.esdlyon.dev/login', params)
        .then((response) =>  response.json())
        .then((json) => {

            return json.token
        })
}


//----------------------------------------------------
function displayLoginForm(){

    loginPage.style.display = 'block'
    chatPage.style.display = 'none'
    containerChat.style.display= 'none'
    loading.style.display = 'none'


    let username = document.querySelector('.username')
    let password = document.querySelector('.password')
    let loginButton = document.querySelector('.submitLogin')
    loginButton.addEventListener('click', ()=>{

        login(username.value, password.value).then((data) => {
            token = data
            displayChat()
            //console.log(token)
        })
    })
}
//--------------------------------------------------------
function displayMessages(){
    document.querySelector('.messages').innerHTML = ""
    messages.forEach(message => {

        divMessage = document.createElement('div')
        divMessage.classList.add('message')
        let paragraphe = document.createElement('p')
        paragraphe.textContent = message.content
        divMessage.appendChild(paragraphe)


        if(message.author === "Felix")
        {
            divMessage.classList.add('felix')
        }else{
            divMessage.classList.add('user')

        }
        document.querySelector('.messages').appendChild(divMessage)
    })



}
//--------------------------------------------------------------------
function handlePrompt(){
    let prompt = document.querySelector('.prompt')
    let submitButton = document.querySelector('.chatSubmit')
    const buttonAnglais = document.querySelector('.buttonAnglais')


    submitButton.addEventListener('click', ()=>{
        addMessageToMessagesArray({
            author : "User",
            content:prompt.value

        })
    buttonAnglais.addEventListener('click', () =>{
        console.log('message en anglais')
        addMessageToMessagesArray({
            author: "Felix",
            content : messageInEnglish.value
        })
    })

        displayMessages()
        prompt.value = ''


        askIa(prompt.value).then((data) => {
            console.log(data)
            addMessageToMessagesArray({
                author : "Felix",
                content:data
            })
            displayMessages()
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

async function askIa(prompt)
{
    let params = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            prompt: prompt,
        })
    }


    loading.style.display = 'block'


    return await fetch('https://felix.esdlyon.dev/ollama', params)
        .then(response => response.json())
        .then((json) => {

            console.log(json)
            loading.style.display = 'none'
            return json.message

        })

}






function addMessageToMessagesArray(message)
{
    messages.push(message)
}

function displayChat(){
    chatPage.style.display = 'block'
    containerChat.style.display = 'block'
    loginPage.style.display = 'none'
    containterLogin.style.display = 'none'

    displayMessages()
    handlePrompt()
}




if(!token){
    displayLoginForm()
}else{
    displayChat()
    displayMessages()
}












// pour interroger l'IA il faut :
//un token à stocker dans un header Authorization : "Bearer ${token}"
//un header application.json
//le corps de requete doit etre en json, avec une clé "prompt", donc :
// {
// "prompt": "ma question"
// }