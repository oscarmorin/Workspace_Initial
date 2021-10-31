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

    let perfil = {
        "nombre" : nombre.value,
        "edad" : edad.value,
        "telefono" : telefono.value,
        "email" : email.value
    }

    localStorage.setItem("perfil", JSON.stringify(perfil));
    
}

function getData(){

    let datosPerfil = JSON.parse(localStorage.getItem("perfil"));

    if (datosPerfil !== null ){

        nombre.value = datosPerfil.nombre; 
        edad.value =  datosPerfil.edad;
        telefono.value = datosPerfil.telefono;
        email.value = datosPerfil.email;
    }
    
}

function getImage (){
    
        if (localStorage.getItem("imgUser") === null){
            localStorage.setItem("imgUser", "img/imgUser.png");
        }

}

function setImage(){
    var imgUser = document.createElement("img");
        imgUser.setAttribute("src",localStorage.getItem("imgUser"));
        imgUser.setAttribute('width', 150);
        imgUser.setAttribute('height', 150);

    img.appendChild(imgUser);
}

document.getElementById("imgChange").addEventListener("change", function(){

    const reader = new FileReader();

    reader.addEventListener("load", () => {
        localStorage.setItem("imgUser", reader.result);
        img.innerHTML = '';
        setImage();
    })

    reader.readAsDataURL(this.files[0]);

})