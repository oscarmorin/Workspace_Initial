let costoEnvio = document.getElementById('envio');
let articles = document.getElementById('articles');
let cartAdd = [];
let productCart = "";  
let nCantidad = 0;
const items = document.getElementById('items');

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    //muestro los articulos
    showArticles();   

});  

function showArticles(){

    let htmlContentToAppend = "";
    productCart ='';
    nCantidad = 0;   

    getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json").then(function(response){

        if(response.status === 'ok'){

            cartAdd = response.data.articles;
            
            
            for(i=0; i < response.data.articles.length; i++){

                let articles = response.data.articles[i];

                if(articles.currency === "USD"){
                    articles.unitCost = articles.unitCost * 40;
                    articles.currency = "UYU";
                }

                htmlContentToAppend += `   
                
                <div class="card col col-lg-4 p-2">   
                        <img src=" ${articles.src} " class="card-img-top" style=" height: 10rem;">
                <div class="card-body">
                    <h5 class="card-title">${articles.name}</h5>
                    <p class="card-text">${articles.unitCost}</p>
                    <h6 class="card-text">${articles.currency}</h6>
                    <button class="btn btn-primary" onclick="showArticles(); ">Ver en carrito</button>
                    </div>
                </div>
                    
                `

            
               showCart(articles);

               nCantidad += articles.count;
                
            }   
            
            

            //Modifico en html total cantidad 
            document.getElementById('tProducts').textContent = nCantidad;

            //agrego articulos al html
            articles.innerHTML = htmlContentToAppend;
            //calculo precio total
            showTotalPrice ();
           
            
        }
       
    });
}


function showCart (array){

        productCart += `
                <tr>
                <td>${array.name}</td>
                <td id="${array.name}">${array.count}</td>
                <td>
                 <button data-id="${i}" class="btn btn-info btn-sm">
                 +
                </button>
                <button data-id="${i}"  class="btn btn-danger btn-sm">
                    -
                </button>
                </td>
                <td><span id="${array.unitCost}">${array.count * array.unitCost}</span> UYU</td>
                </tr>
                `  

            items.innerHTML = productCart; 
   

}

function showTotalPrice(){
    
    valor1 = parseInt(document.getElementById('100').textContent);
    valor2 = parseInt(document.getElementById('500000').textContent);

    document.getElementById('total').textContent = valor1 + valor2 + " UYU ";
    
}

items.addEventListener('click', e =>{
    btnAction(e);
})

const btnAction = e => {

    //Accion aumentar
    if(e.target.classList.contains("btn-info")){

       const product = cartAdd[e.target.dataset.id];

       //resto la cantidad en el arreglo
       product.count = cartAdd[e.target.dataset.id].count + 1 ;

       //Hago copia del arreglo
       cartAdd[e.target.dataset.id] = {...product}

       //Modifico en html cantidad producto
       document.getElementById(cartAdd[e.target.dataset.id].name).textContent = cartAdd[e.target.dataset.id].count;
       
       //sumo cantidad en total
       nCantidad += 1 ;
       
        //Modifico en html total costo producto
       document.getElementById(cartAdd[e.target.dataset.id].unitCost).textContent = cartAdd[e.target.dataset.id].count * cartAdd[e.target.dataset.id].unitCost;

       //Modifico en html total cantidad 
       document.getElementById('tProducts').textContent = nCantidad;
        
    }

    //accion disminuir
    if(e.target.classList.contains("btn-danger")){

        const product = cartAdd[e.target.dataset.id];
 
        if(product.count > 0){
        
        //resto la cantidad en el arreglo
        product.count = cartAdd[e.target.dataset.id].count - 1 ;

        //Hago copia del arreglo
        cartAdd[e.target.dataset.id] = {...product}
            
        //Modifico en html cantidad producto
        document.getElementById(cartAdd[e.target.dataset.id].name).textContent = cartAdd[e.target.dataset.id].count;

        //resto cantidad en total
        nCantidad -= 1 ;

        //Modifico en html total cantidad
        document.getElementById('tProducts').textContent = nCantidad;

        //Modifico en html total costo
        document.getElementById(cartAdd[e.target.dataset.id].unitCost).textContent = cartAdd[e.target.dataset.id].count * cartAdd[e.target.dataset.id].unitCost;
        
        }      

     }
     e.stopPropagation();
     showTotalPrice();
}

const btnVaciar = document.getElementById('vaciar-carrito');
btnVaciar.addEventListener('click',() =>{
    items.innerHTML = '';
    productCart ='';
    nCantidad = 0;
    document.getElementById('tProducts').textContent = '0';
    document.getElementById('total').textContent = '0';

})




