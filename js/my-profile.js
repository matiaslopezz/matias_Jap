function showInformation(){
    personal_information = JSON.parse(localStorage.getItem("personal_information"));
    if (personal_information){
        if (document.getElementById("saved-name") != null){
            document.getElementById("saved-name").innerHTML = personal_information.name;
            document.getElementById("saved-surname").innerHTML = personal_information.surname;
            document.getElementById("saved-age").innerHTML = personal_information.age;
            document.getElementById("saved-email").innerHTML = personal_information.email;
            document.getElementById("saved-phone").innerHTML = personal_information.phoneNumber;
        }
    }

    profile_image = localStorage.getItem("profile_image");
    if (profile_image){
        document.getElementById("profile-image").innerHTML = `
            <img src="`+ localStorage.getItem("profile_image") +`" alt="" style="width: 15rem";>
        `;     
    }
}

function saveInformation(){
    document.getElementById("profile-form").addEventListener("submit", (e)=>{
        var nameInput = document.getElementById("name").value
        var surnameInput= document.getElementById("surname").value
        var ageInput = document.getElementById("age").value
        var emailInput = document.getElementById("email").value
        var phoneInput = document.getElementById("phone-number").value
    
        var newObject = {
            'name' : nameInput,
            'surname' : surnameInput,
            'age' : ageInput,
            'email' : emailInput,
            'phoneNumber' : phoneInput,
        }

        let imageURL = "https://i.ibb.co/qMjcYzG/profile-image.jpg"
        localStorage.setItem("profile_image", imageURL);
        
        localStorage.setItem("personal_information",JSON.stringify(newObject))

        showInformation();
    })
}


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    saveInformation();
    showInformation();
});