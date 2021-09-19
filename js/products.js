//creo constantes y variables globales
const ORDER_ASC_BY_PRICE = "priceAsc";
const ORDER_DESC_BY_PRICE = "priceDesc";
const ORDER_BY_PROD_SOLD = "soldCount";
var currentProductsArray = [];
var currentSortCriteria = undefined;
var minPrice = undefined;
var maxPrice = undefined;
const text = document.getElementById('search');
const container = document.getElementById("container");

//Funcion que ordena los productos segun criterio
function sortPrice(criteria, array){
    let result = [];
    if (criteria === ORDER_ASC_BY_PRICE)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_PRICE){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_PROD_SOLD){
        result = array.sort(function(a, b) {

            if ( a.soldCount > b.soldCount ){ return -1; }
            if ( a.soldCount < b.soldCount ){ return 1; }
            return 0;
        });
    }
    return result;
}

//funcion que muestra la lista de productos
function showProductsList (){

    let htmlContentToAppend = "";
            
            for (i=0; i < currentProductsArray.length; i++){

                let products = currentProductsArray[i];

                //creo condicion para filtrar por precio
                if (((minPrice == undefined) || (minPrice != undefined && products.cost >= minPrice)) && ((maxPrice == undefined) || (maxPrice != undefined && products.cost <= maxPrice))){               

                //creo html con los datos obtenidos del array
                htmlContentToAppend += `
                    <a href="product-info.html" class="list-group-item list-group-item-action">
                            <div class="row">
                                <div class="col-3">
                                    <img src="` + products.imgSrc + `" alt="` + products.description + `" class="img-thumbnail">
                                </div>
                            <div class="col">
                                <div class="d-flex w-100 justify-content-between">
                                    <h4 class="mb-1">`+ products.name +`</h4>
                                    <small class="text-muted">` + products.soldCount + ` artículos</small>
                                </div>
                                <p class="mb-1">` + products.description + `</p>
                                <p class="mb-1">` + products.cost + " " +  products.currency + `</p>
                            </div>
                        </div>
                    </a>
                `
            }

            //agrego lista al html
            container.innerHTML = htmlContentToAppend;
        }
}

//Funcion que ordena la lista de productos por criterio
function sortAndShowProducts(sortCriteria, productsArray){
    currentSortCriteria = sortCriteria;

    if(productsArray != undefined){
        currentProductsArray = productsArray;
    }

    currentProductsArray = sortPrice(currentSortCriteria, currentProductsArray);

    //Muestro los productos ordenadas
    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(PRODUCTS_URL).then(function(response){

        if(response.status === 'ok'){

        sortAndShowProducts(ORDER_ASC_BY_PRICE, response.data);

        }
    });

    //Evento ordenar por asc
    document.getElementById("priceAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    //Evento ordenar por precio desc
    document.getElementById("priceDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    //Evento ordenar por soldCount
    document.getElementById("sortBySold").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_PROD_SOLD);
    });

    //Evento limpiar filtro
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterPriceMin").value = "";
        document.getElementById("rangeFilterPriceMax").value = "";

        minPrice = undefined;
        maxPrice = undefined;

        showProductsList();

    });

    //Evento filtrar
    document.getElementById("rangeFilterPrice").addEventListener("click", function(){
        minPrice = document.getElementById("rangeFilterPriceMin").value;
        maxPrice = document.getElementById("rangeFilterPriceMax").value;
  
    if ((minPrice != undefined) && (minPrice != "") && (parseInt(minPrice) >= 0)){
        minPrice = parseInt(minPrice);
    } else {
        minPrice = undefined;
    }

    if ((maxPrice != undefined) && (maxPrice != "") && (parseInt(maxPrice) >= 0)){
        maxPrice = parseInt(maxPrice);
    } else {
        maxPrice = undefined;
    }

    showProductsList();

    });

});

//evento search

function search(){
    
    //Convierto todo lo que se escribe el buscador a minuscula
    const texto = text.value.toLowerCase();
    //Cada vez que ejecuto la funcion hace un reset de lo que hay en el html
    container.innerHTML = '';   

    for (let product of currentProductsArray ){
        //convierto los nombres de los productos que hay en el array para comparar y encontrar coincidencias
        let name = product.name.toLowerCase();        
       
        //recorro el array para encontrar coincidencias entre lo que se busca y los productos
        if (name.indexOf(texto) !== -1){
            
            container.innerHTML += `
            <a href="product-info.html" class="list-group-item list-group-item-action">
                    <div class="row">
                        <div class="col-3">
                            <img src="` + product.imgSrc + `" alt="` + product.description + `" class="img-thumbnail">
                        </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">`+ product.name +`</h4>
                            <small class="text-muted">` + product.soldCount + ` artículos</small>
                        </div>
                        <p class="mb-1">` + product.description + `</p>
                        <p class="mb-1">` + product.cost + " " +  product.currency + `</p>
                    </div>
                </div>
            </a>
        `
           
        } 
         
    }
    //Si no hay coincidencias despues de recorrer el array muestro sin resultados
    if (container.innerHTML === ''){
        container.innerHTML = `<h4 class="mb-1">no hay resultados...</h4>`
    }
    
}
//ejecuto la funcion search cada vez que se presiona una tecla
text.addEventListener('keyup',search);
