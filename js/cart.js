const items = document.getElementById('items');
let costoEnvio = document.getElementById('envio');
let articles = document.getElementById('articles');
let tdc = document.getElementById('tdc');
let tfc = document.getElementById('tfc');
let mPaymentShopping = document.getElementById('mPayment');
let cartAdd = [];
let productCart = "";  
let nCantidad = 0;
let htmlContentToAppend = '';


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){
    //muestro los articulos
    showArticles();   

});  

function showArticles(){

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
         
               showCart(articles);

               nCantidad += articles.count;
                
            }               

            //Modifico en html total cantidad 
            document.getElementById('tProducts').textContent = nCantidad;

            //calculo precio total
            showTotalPrice ();        
            
        }
       
    });
}

//Mostrar carrito
function showCart (array){

        productCart += `
                <tr id="${i}">
                <td><img src=" ${array.src} " class="card-img-top" style=" height: 70px; width: 60px;"></td>
                <td>${array.name}</td>
                <td id="${array.name}">${array.count}</td>
                <td>
                 <button data-id="${i}" class="btn btn-info btn-sm">
                 +
                </button>
                <button data-id="${i}"  class="btn btn-danger btn-sm">
                    -
                </button>
                <button data-id="${i}"  class="btn btn-dark btn-sm">
                    Eliminar
                </button>
                </td>
                <td><span id="${array.unitCost}">${array.count * array.unitCost}</span> UYU</td>
                </tr>
                `  

            items.innerHTML = productCart;   

}

//Calcular precio total
function showTotalPrice(){
    
    numbers();
    
    let valor3 = parseInt(document.getElementById('envio').textContent);

        document.getElementById('total').textContent = valor1 + valor2 + valor3 + " UYU ";
    
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

     //accion eliminar
    if(e.target.classList.contains("btn-dark")){

        //resto cantidad en total
        nCantidad -= cartAdd[e.target.dataset.id].count;
        
        //Modifico en html total cantidad
        document.getElementById('tProducts').textContent = nCantidad;

        //Elimino el producto
        document.getElementById(e.target.dataset.id).textContent='';
        

     }

     e.stopPropagation();
     shipping ();
}

//Evento vacair carrito
const btnVaciar = document.getElementById('vaciar-carrito');
btnVaciar.addEventListener('click',() =>{
    items.innerHTML = '';
    productCart ='';
    nCantidad = 0;
    document.getElementById('tProducts').textContent = '0';
    document.getElementById('total').textContent = '0';
});

//Metodo de pago
function mPayment (value){

    if ( value === 'tdc'){

        tdc.style.background = '#008f39';
        tfc.style.background = '';  

        mPaymentShopping.innerHTML = `
        <label class="m-2">Titular de la tarjeta</label>
        <input type="text" id="nombreTDC" class="form-control m-2" required></>
        <label class="m-2">Número de tarjeta</label>
        <input type="text" id="numeroTDC" class="form-control m-2" required></>
        <label class="m-2">Código seguridad</label>
        <input type="text" id="codigoTDC" class="form-control m-2" required></>
        <label class="m-2">Fecha de vencimiento</label>
        <input type="text" id="vencimientoTDC" class="form-control m-2" required></>
        `;

    } else if (value === 'tfc'){

        tfc.style.background = '#008f39'; 
        tdc.style.background = ''; 

        mPaymentShopping.innerHTML = `
        <label class="m-2">Titular de la cuenta</label>
        <input class="form-control m-2" id="nombreTFC" required></>
        <label class="m-2">Número de cuenta</label>
        <input class="form-control m-2" id="numeroTFC" required></>
        `;

    }

}

//Funcion para carcular el envio
function shipping (){
    //obtengo los input con el nombre 
    var myRadio = $("input[name=flexRadioDefault]");
    //filtro los input para saber cual esta seleccionado
    var checkedValue = myRadio.filter(":checked").val();

    //Asigno funcion dependiendo del input seleccionado
    if(checkedValue === '0'){
        costoEnvio.textContent = '0';
        showTotalPrice();
        formShipping (checkedValue);
    } else if(checkedValue === '15'){
        
        numbers();
        costoEnvio.textContent = Math.trunc((valor2 + valor1)*0.15);
        showTotalPrice();
        formShipping (checkedValue);
    } else if(checkedValue === '7'){
        
        numbers();
        costoEnvio.textContent = Math.trunc((valor2 + valor1)*0.07);
        showTotalPrice();
        formShipping (checkedValue);
    } else if(checkedValue === '5'){
       
        numbers();
        costoEnvio.textContent = Math.trunc((valor2 + valor1)*0.05);
        showTotalPrice();
        formShipping (checkedValue);
    }
}

//Funcion para Form metodo de envio
function formShipping (number){

    //Si selecciono retiro en tienda no muestro form
    if (number === '0'){
        htmlContentToAppend = '';
        document.getElementById('formulario').className = 'd-none';
    } else {

    //verifico que solo se ejecute la funcion si esta vacio el elemento 
    if (htmlContentToAppend === ''){

        document.getElementById('formulario').className += 'd-block card col-md-5 ml-5 p-1 ';

        htmlContentToAppend = `
    <div class="card-body">   
    <form class="needs-validation m-5">
      <div class="form-group">
        <label for="name">Nombre</label>
        <input type="email" class="form-control" id="name" aria-describedby="emailHelp" placeholder="Ingrese nombre" required>
      </div>
      <div class="form-group">
        <label for="direccion">Dirección</label>
        <input type="text" class="form-control" id="direccion" placeholder="Ingrese dirección" required>
      </div>
      <div class="form-group">
        <label for="telefono">Número de contacto</label>
        <input type="text" class="form-control" id="numero" placeholder="Ingrese numero de contacto" required>
      </div>
        
    </form>
    </div>

    `
    }
    }

    document.getElementById('formulario').innerHTML = htmlContentToAppend;
}

//Funcion para validar y ejecutar compra de articulos
function validate(){
    let direccion = document.getElementById('direccion');
    if (direccion){
    let nombre = document.getElementById('name');
    let numero = document.getElementById('numero');

    if (direccion.value === '' || nombre.value === '' || numero.value === ''){
        alert('Complete campos');
    }

    if (direccion.value === ''){
        direccion.style.borderColor = 'red';
    } else {
        direccion.style.borderColor = 'gray';
    }

    if (nombre.value === ''){
        nombre.style.borderColor = 'red';
    } else {
        nombre.style.borderColor = 'gray';
    }
    if (numero.value === ''){
        numero.style.borderColor = 'red';
    } else {
        numero.style.borderColor = 'gray';
    }

    if(direccion.value !== '' && nombre.value !== '' && numero.value !== ''){
        document.querySelector('body').innerHTML += `<div class="alert alert-success alert-dismissible" role="alert">
        Su compra se ha realizado con éxito!
        Gracias por preferirnos.
      </div>`
      
      setTimeout(() => {

        $(".alert").alert('close');  
          
      }, 3000);   

    }
    } else {

        document.querySelector('body').innerHTML += `<div class="alert alert-success alert-dismissible" role="alert">
        Su compra se ha realizado con éxito!
        Gracias por preferirnos.
      </div>`
      
      setTimeout(() => {

        $(".alert").alert('close');
         
      }, 3000);

    }
}

//Validar metodo de pago para mostrar luego el boton finalizar compra
function validatePayment (){

    let nombreTDC = document.getElementById('nombreTDC');
    let nombreTFC = document.getElementById('nombreTFC');

        if (nombreTDC){
            
            let numeroTDC = document.getElementById('numeroTDC');
            let codigoTDC = document.getElementById('codigoTDC');
            let vencimientoTDC = document.getElementById('vencimientoTDC');
    
            if (nombreTDC.value === '' || numeroTDC.value === '' || codigoTDC.value === '' || vencimientoTDC.value === ''){
                alert('Complete campos de tarjeta de crédito');
            }  else {
                document.getElementById('buttons').innerHTML +=
                `
                <button type="button" class="btn btn-danger m-3" onclick="validate();">
                Completar compra
                </button>
              `
              document.getElementById('alert').innerHTML = '';
            }

            if(nombreTDC.value === ''){
                nombreTDC.style.borderColor = 'red';
            } else {
                nombreTDC.style.borderColor = 'gray';
            }

            if(numeroTDC.value === ''){
                numeroTDC.style.borderColor = 'red';
            } else {
                numeroTDC.style.borderColor = 'gray';
            }

            if(codigoTDC.value === ''){
                codigoTDC.style.borderColor = 'red';
            } else {
                codigoTDC.style.borderColor = 'gray';
            }

            if(vencimientoTDC.value === ''){
                vencimientoTDC.style.borderColor = 'red';
            } else {
                vencimientoTDC.style.borderColor = 'gray';
            }
        }
            
        if(nombreTFC){

            let numeroTFC = document.getElementById('numeroTFC');

            if (nombreTFC.value === '' || numeroTFC.value === ''){
                alert('Complete campos para transferencia');
            }   

            if(nombreTFC.value === ''){
                nombreTFC.style.borderColor = 'red';
            } else {
                nombreTFC.style.borderColor = 'gray';
            }

            if(numeroTFC.value === ''){
                numeroTFC.style.borderColor = 'red';
            } else {
                numeroTFC.style.borderColor = 'gray';
            }
        }

}

//Funcion que permite calcular el total si elimino algun producto
function numbers(){

    if(document.getElementById('100')){
        valor1 = parseInt(document.getElementById('100').textContent);
   } else {
        valor1 = 0;
   }
   if(document.getElementById('500000')){
    valor2 = parseInt(document.getElementById('500000').textContent);
} else {
    valor2 = 0;
}

}




