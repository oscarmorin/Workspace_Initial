//Let globales
let currentProductsArray = [];
let fecha = "";
let add = document.getElementById('add');
let scores = "";

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", function(e){
    getJSONData(PRODUCT_INFO_URL).then(function(response){
        if(response.status === 'ok'){

            product = response.data;
            let name        = document.getElementById('productName');
            let description = document.getElementById('productDescription');
            let price       = document.getElementById('productCost');
            let soldCount   = document.getElementById('soldCount');

            name.innerHTML = product.name;
            description.innerHTML = product.description
            price.innerHTML = product.cost + " " + product.currency;
            soldCount.innerHTML = product.soldCount;

            //Muestro las imagenes en forma de galería
            showImagesGallery(product.images);
        }
    })

    getJSONData(PRODUCT_INFO_COMMENTS_URL).then(function(response){
        if(response.status === 'ok'){
            currentProductsArray = response.data;
            showComments();
        }
    })
});

//Funcion mostrar imagenes 
function showImagesGallery (array){

    let htmlContentToAppend = "";

    for(let i = 0; i < array.length; i++){
        let imageSrc = array[i];

        htmlContentToAppend += `
        <div class="col-lg-3 col-md-4 col-6">
            <div class="d-block mb-4 h-100">
                <img class="img-fluid img-thumbnail" src="` + imageSrc + `" alt="">
            </div>
        </div>
        `

        document.getElementById("productImagesGallery").innerHTML = htmlContentToAppend;
    }
}

//Funcion mostrar comentarios 
function showComments(){

   let htmlContentToAppend = "";

    for(let i = 0; i < currentProductsArray.length; i++){

        let comments = currentProductsArray[i];

        scores="";
        showStar(comments.score);

        htmlContentToAppend += `
        <div class="border rounded border-secondary mt-3 p-2">
        ` + scores + `
        <p>` + comments.description + `</p>
        <p>` + comments.user + `</p>
        <p>` + comments. dateTime+ `</p>
        </div>
        `
    }
    
    document.getElementById("comments").innerHTML += htmlContentToAppend;

}

//Evento ejecutar funcion mostrar nuevos comentarios
add.addEventListener("click",function (e){

            e.preventDefault();
            getFullDate();
     
            let htmlContentToAppend = "";
            let name = localStorage.getItem('user');
            let comment = document.getElementById('comment').value;
            let star = document.getElementById('score').value;

            if(comment.length === 0 || star === "0"){

                alert('Ingrese comentario')

            } else {

                scores = "";
                showStar(star);
    
                htmlContentToAppend +=`
                <div class="border border-secondary rounded mt-3 p-2">
                ` + scores + `
                <p>` + comment + `</p>
                <p>` + name + `</p>
                <p>` + dateTime + `</p>
                </div>
                `
                document.getElementById("comments").innerHTML += htmlContentToAppend;

                document.getElementById('form').reset();
                showComments();
            }
            
})

//Funcion obtener fecha
function getFullDate() {

      dateTime = "";
      var date = new Date()
      var hrs = date.getHours();
      var min = date.getMinutes();
      var sec = date.getSeconds();
      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();
        
     dateTime = year + "-" + month + "-" + day + " " + hrs + ":" + min + ":" + sec;
    
    }
    
//Funcion mostrar estrellas
function showStar(stars){

        for (let i = 0; i < 5; i++){
            if (i < stars ){
                scores += `<span class="fa fa-star checked"></span>`
            } else {
                scores += `<span class="fa fa-star"></span>`
            }     
        }            
}

    
  

   

    