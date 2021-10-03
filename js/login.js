//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function(e){

    document.getElementById('form').addEventListener('submit', validarFormulario);

     //llamo a la funcion obtener usuario
     getUser (); 

});

//funcion para validar los campos mediante javascript

function validarFormulario(evento){

        evento.preventDefault();

        var user = document.getElementById('user').value; 
        var pass = document.getElementById('pass').value; 

        if(user.length === 0 || pass.length === 0){
            alert('Complete los campos');
            document.getElementById('form').reset();
        } else {
            this.submit();
        }
}

// guardo el user en localStorage
function getUser (){

    document.getElementById('btn').addEventListener("click", function(){
  
      var user = document.getElementById('user').value;
  
      if (user != undefined && user != ""){
  
          localStorage.setItem('user', user);
          
      } 
      
  });
  
  }
 

