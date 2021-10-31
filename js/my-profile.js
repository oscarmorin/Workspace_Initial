let nombre     = document.getElementById('name');
let edad     = document.getElementById('edad');
let telefono = document.getElementById('numero');
let email    = document.getElementById('email');
let img = document.getElementById("imgUser");

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    getData();
    getImage();
    setImage();
    

});

function setData(){

    //Creo el objeto
    let perfil = {
        "nombre" : nombre.value,
        "edad" : edad.value,
        "telefono" : telefono.value,
        "email" : email.value
    }

    //Guardo en local storage objeto en forma de string
    localStorage.setItem("perfil", JSON.stringify(perfil));
    
}

//Funcion mostrar data en HTML
function getData(){

    //Obtengo data y convierto a JSON
    let datosPerfil = JSON.parse(localStorage.getItem("perfil"));

    //Si data es distinto de null modifico value de input
    if (datosPerfil !== null ){

        nombre.value = datosPerfil.nombre; 
        edad.value =  datosPerfil.edad;
        telefono.value = datosPerfil.telefono;
        email.value = datosPerfil.email;
    }
    
}

//Obtengo ubicación de imagen
function getImage (){
    
        if (localStorage.getItem("imgUser") === null){
            localStorage.setItem("imgUser", "img/imgUser.png");
        }

}

//Funcion mostrar img HTML
function setImage(){

    //Creo elemento HTML img
    var imgUser = document.createElement("img");
        imgUser.setAttribute("src",localStorage.getItem("imgUser"));
        imgUser.setAttribute('width', 150);
        imgUser.setAttribute('height', 150);

    //Muestro imagen en html
    img.appendChild(imgUser);
}

//Evento cargar nueva imagen
document.getElementById("imgChange").addEventListener("change", function(){

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        localStorage.setItem("imgUser", reader.result);
        img.innerHTML = '';
        setImage();
    })

    //Muestro imagen seleccionada
    reader.readAsDataURL(this.files[0]);

})