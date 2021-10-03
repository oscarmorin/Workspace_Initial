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

            let product = response.data;
            let name        = document.getElementById('productName');
            let description = document.getElementById('productDescription');
            let price       = document.getElementById('productCost');
            let soldCount   = document.getElementById('soldCount');
            let relatedProducts = product.relatedProducts;

            getJSONData(PRODUCTS_URL).then(function(res){
                if (res.status === 'ok'){
                    let products = res.data;
                    for (let i = 0; i < res.data.length; i++){
                        for (let valor of relatedProducts){                           
                            if (i ===  valor ){
                                document.getElementById('pRelated').innerHTML +=
                                `
                                
                                    <div class="card col col-lg-4 " style="width: 18rem;">
                                        <img src="${products[i].imgSrc}" class="card-img-top" alt="${products[i].description}">
                                        <div class="card-body">
                                            <h5 class="card-title">${products[i].name}</h5>
                                            <p class="card-text">${products[i].description}</p>
                                            <a href="#" class="btn btn-primary">Ver más</a>
                                        </div>
                                    </div>
                                

                            `;
                            }
                        }
                    }

                }
            });

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
    let indicators = "";

    for(let i = 0; i < array.length; i++){
        if(i === 0){
            htmlContentToAppend += `
            <div class="carousel-item active">
                <img class="d-block w-100" src="${array[i]}" alt="Second slide">
            </div>
            `
            indicators += `<li data-target="#carouselExampleIndicators" data-slide-to="${i}" class="active"></li>`
        } else {
            htmlContentToAppend += `
            <div class="carousel-item">
                <img class="d-block w-100" src="${array[i]}" alt="Second slide">
            </div>
            ` 
            indicators += `<li data-target="#carouselExampleIndicators" data-slide-to="${i}"></li>`
        }
    }

    document.getElementById("productImagesGallery").innerHTML += htmlContentToAppend;
    document.getElementById("indicators").innerHTML += indicators;
    
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

    
  

   

    