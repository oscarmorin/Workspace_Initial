let subT = document.getElementById('subtotal');
let costoEnvio = document.getElementById('envio');
let articles = document.getElementById('articles');
let cart = {};
let cartAdd = {}
let productCart = "";  
const fragment = document.createDocumentFragment();
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

    getJSONData("https://japdevdep.github.io/ecommerce-api/cart/654.json").then(function(response){

        if(response.status === 'ok'){

            let data = response.data.articles;
            cartAdd = data ;
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
                    <h4 class="d-none">${articles.count}</h4>
                    <span id = ${i} class="d-none">${i}</span>
                    <h5 class="card-title">${articles.name}</h5>
                    <p class="card-text">${articles.unitCost}</p>
                    <h6 class="card-text">${articles.currency}</h6>
                    <button class="btn btn-primary">Comprar</button>
                    </div>
                </div>
                    
                `
               showCart(articles);
                
            }    

            //agrego articulos al html
            articles.innerHTML = htmlContentToAppend;
            //calculo precio total
            showTotalPrice ();
            //calculo productos total
            showTotalProducts(data);
            
        }
       
    });
}


articles.addEventListener("click", e =>{
    
    if(e.target.classList.contains("btn-primary")){
        setCart(e.target.parentElement);
    }
    //detener cualquier evento que pueda heredar del contenedor padre
    e.stopPropagation();
});

const setCart = objeto =>{
   
    //Creo el objeto con los datos a mostrar en el carrito
    const products = {
        id: objeto.querySelector("span").textContent,
        name: objeto.querySelector("h5").textContent,
        unitCost: objeto.querySelector("p").textContent,
        count: parseInt(objeto.querySelector("h4").textContent) + 1
    }

    //Comprobar si ya esta seleccionado el producto en el carrito y asi sumarle 1
    if(cart.hasOwnProperty(products.id)){
        products.count = parseInt(cart[products.id].count)+ 1;
    
    }
    //
    cart[products.id] = {...products};
    //ejecuto añadir al carrito
    addCart(cart); 
   
}

function addCart(){    
    
    Object.values(cart).forEach(elements => {
        
        //guardo el contenido del id en span de articles
        id = document.getElementById(elements.id).textContent;

        if (id === elements.id){
            document.getElementById(elements.name).textContent = elements.count;
            subTotal(elements.count,elements.unitCost);       
        }        
    
    });

    //Muestro total productos
    showTotalProducts(cart);
    //Muestro total precio
    showTotalPrice();
    
    
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
        footer = `
        <th scope="row" >Total productos</th>
        <td id="tProducts">10</td>
        <td>
        <button class="btn btn-danger btn-sm" id="vaciar-carrito">
            vaciar todo
        </button>
        </td>
        <td class="font-weight-bold">$ <span id="total">5000</span></td>
        `

    items.innerHTML = productCart; 
   

}

function subTotal(a,b) {
    document.getElementById(b).textContent = a * b;  
}

function showTotalPrice(){
    
    valor1 = parseInt(document.getElementById('100').textContent);
    valor2 = parseInt(document.getElementById('500000').textContent);

    document.getElementById('total').textContent = valor1 + valor2 + " UYU ";
    
}


let nPrecio = 0;
let nCantidad = 0;
function showTotalProducts(array){ 

    if (nCantidad === 0){
    nCantidad = Object.values(array).reduce((acc,{count}) => acc + count ,0);
    } else {
    nCantidad += 1 ;
    }

    document.getElementById('tProducts').textContent = nCantidad;
    
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
    document.getElementById('tProducts').textContent = '0';
    document.getElementById('total').textContent = '0';
    cart = {};

})




