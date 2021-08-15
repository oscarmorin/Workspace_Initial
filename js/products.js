//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {

    getJSONData(PRODUCTS_URL).then(function(response){

        if(response.status === 'ok'){
            console.log(response.data);
            for (i=0; i < response.data.length; i++){
                document.getElementById('container').innerHTML += `
                <a href="product-info.html" class="list-group-item list-group-item-action">
                <div class="row">
                <div class="col-3">
                    <img src="` + response.data[i].imgSrc + `" alt="` + response.data[i].description + `" class="img-thumbnail">
                </div>
                <div class="col">
                    <div class="d-flex w-100 justify-content-between">
                        <h4 class="mb-1">`+ response.data[i].name +`</h4>
                        <small class="text-muted">` + response.data[i].soldCount + ` artículos</small>
                    </div>
                    <p class="mb-1">` + response.data[i].description + `</p>
                    <p class="mb-1">` + response.data[i].cost + " " +  response.data[i].currency + `</p>
                </div>
            </div>`
            }
        }
    });

});