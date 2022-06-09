//Creo variables globales
let precio = 0;
let unidad = 0;
let precioTotal = 0;
let precioFinal = 0;
let resultado;
//Tomo id de los forms
let productos = document.getElementById("productos");
let unidades = document.getElementById("unidades");
let precioProductos = document.getElementById("precioProductos");
let total = document.getElementById("total");
let vaciarCarro = document.getElementById("vaciarCarro");
let verCarro = document.getElementById("verCarro");
let metodosPago = document.getElementById("metodosPago");
let pagar = document.getElementById("pagar");
let cuotasSeleccionadas = document.getElementById("cuotas");
let modal = document.getElementById("modal__");
let cerrarModal = document.querySelector(".modal__close");
let contenidoTexto = document.getElementById("contenidoText");
let tabla = document.getElementById("tabla");
let contenidoTable = document.getElementById("tableContent");
//Creo un array de productos y métodos de pago.
const productosMarket = [
  { ID: 1, nombre: "Manzana", precio: 20, unit: 0 },
  { ID: 2, nombre: "Banana", precio: 40, unit: 0 },
  { ID: 3, nombre: "Palta", precio: 60, unit: 0 },
  { ID: 4, nombre: "Zanahoria", precio: 30, unit: 0 },
  { ID: 5, nombre: "Choclo", precio: 50, unit: 0 },
  { ID: 6, nombre: "Zapallo", precio: 85, unit: 0 },
];
const metodos = [
  { nombre: "Tarjeta de crédito", descuentoORecargo: 0 },
  { nombre: "Tarjeta de débito", descuentoORecargo: 1.1 },
  { nombre: "Efectivo", descuentoORecargo: 0.8 },
];
const cuotas = [
  { nombre: "1 cuota", recargo: 1.1, numero: 1 },
  { nombre: "3 cuotas", recargo: 1.4, numero: 3 },
  { nombre: "6 cuotas", recargo: 1.6, numero: 6 },
  { nombre: "12 cuotas", recargo: 1.8, numero: 12 },
];
let carrito = [];
//Le pregunto al storage si hay datos en el.
if (localStorage.getItem('carrito')!=null || localStorage.getItem('precioTotal')!=null){
  carrito = JSON.parse(localStorage.getItem('carrito'));
  precioTotal = JSON.parse(localStorage.getItem('precioTotal'));
  total.placeholder = "$" + precioTotal;
  }
  else{
  carrito = [];
  
  precioTotal = 0; 
  }
//Función de reseteo de var e index
function reseteo() {
  unidad = 0;
  unidades.value = undefined;
  metodosPago.selectedIndex = "0";
  cuotasSeleccionadas.selectedIndex = "0";
  cuotasSeleccionadas.style.display = "none";
}
//Muestra total si es mayor a 0, si no, se imprime no hay monto.
function zero(param1) {



  //OPERADOR TERNARIO//


  param1 > 0 ? total.placeholder = "$" + precioFinal : total.placeholder = "No hay monto";
}
//Funcion que muestra precio
function mostrarPrecio() {
  //la var "resultado" va a buscar en el array, lo que se haya elegido en el select(Busqué como en 10 páginas y pude saber como tomar el texto de la opción, costó pero se pudo.)
  resultado = productosMarket.find(
    (productosMarket) =>
      productosMarket.nombre === productos.options[productos.selectedIndex].text
  );
  //Precio es el precio del objeto encontrado.
  precio = resultado.precio;
  //Se cambia el monto del placeholder para mostrar el precio.
  precioProductos.placeholder = "$" + precio;
}
function tomarUnidad() {
  //La variable unidad es el valor que se ingrese en el input de unidades.
  unidad = unidades.value;
}
//Sube al carrito las unidades de los productos y los sube al Local Storage
function subirAlCarro() {
  //creo una constante que verifique si el elemento ya existe en el carrito con find.
  const duplicado = carrito.some((elemento) => elemento.ID === resultado.ID);
  console.log(duplicado);
  //Si el resultado es false o no se encontró el elemento, se ejecuta el código dentro.
  if (duplicado == false) {
    //La unidad de resultado va a ser lo que haya en unidad
    resultado.unit = parseInt(unidad);
    //Luego se sube el dato al carrito.
    carrito.push(resultado);
  } else {
    //y si es true, busco donde está el index del elemento encontrado.
    let modificar = carrito.findIndex((elemento)=>elemento.ID == resultado.ID)
    //console.log(modificar);  //Verifico
    //Lo busco en los array del carrito, y le sumo solamente las unidades.
    carrito[modificar].unit += parseInt(unidad);
    
  }
  //Subo el carrito al localStorage con su lenguaje a partir de JSON.
  localStorage.setItem('carrito',JSON.stringify(carrito));
  //Verificación
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Se han añadido los productos al carrito',
    showConfirmButton: false,
    timer: 1500
  })
  console.log(carrito);
  
}
//Al presionar enter, se agregan las unidades ingresadas al carro.
function agregarAlCarro(event) {
  x = event.key;
 
   ///////OPERADOR LÓGICO AND


 x == "Enter" && agregar();
}
function agregar() {
  console.log(carrito);
  if (unidad <= 0||unidad > 10 || unidad % 1 != 0) {
    unidad = 0;
    unidades.value = undefined;
  } else {
    //Subo el dato al carro.
    subirAlCarro();
    //El precio total es el precio tomado del array, por la unidad tomado por input.
    precioTotal += precio * unidad;
    //Se muestra precio total en el input total
    total.placeholder = "$" + precioTotal;
    //Subo el total al storage
    localStorage.setItem('precioTotal',JSON.stringify(precioTotal));
    //Se resetea valor del input "unidad"
    reseteo();
  }
}
/////Function ver carrito//////
function verCarrito(){
  //Abro modal
abrir();
abrirTabla();
//por cada producto dentro de carrito, muestro los datos por innerHTML
  for(const producto of carrito){
    contenidoTable.innerHTML+=
    ` <tr>
    <th scope="row"></th>
    <td>${producto.nombre}</td>
    <td>${producto.precio}</td>
    <td>${producto.unit}</td>
  </tr>
  `
  }
}
function vaciarCarrito() {
  //Reseteo las var para que el precio total se ponga en 0
  precioTotal = 0;
  precioFinal = 0;
  reseteo();
  total.placeholder = "$" + precioTotal;
  //Elimino los datos del array con un for.
  for(let i = carrito.length;i>0; i--){
    carrito.pop();
  }
  localStorage.clear();
  contenidoTable.innerHTML=``;
  Swal.fire({
    position: 'top-end',
    icon: 'success',
    title: 'Se ha vaciado el carrito',
    showConfirmButton: false,
    timer: 1500
  })
}
let resultadoMetodo;
function mostrarPrecioFinal() {
  resultadoMetodo = metodos.find(
    (metodos) =>
      metodos.nombre === metodosPago.options[metodosPago.selectedIndex].text
  );
  if (
    metodosPago.options[metodosPago.selectedIndex].text == "Tarjeta de crédito"
  ) {
    cuotasSeleccionadas.style.display = "flex";
  } else {
    cuotasSeleccionadas.style.display = "none";
    precioFinal = resultadoMetodo.descuentoORecargo * precioTotal;
    zero(precioFinal);
  }
}
//Creo una función para mostrar cuotas.
function mostrarCuotas() {
  //Creo un array donde se busquen la cantidad de cuotas dependiendo de lo que haya elegido el user.
  let resultadoCuotas = cuotas.find(
    (cuotas) =>
      cuotas.nombre ===
      cuotasSeleccionadas.options[cuotasSeleccionadas.selectedIndex].text
  );
  //Entonces realiza el cálculo, el precio final es el resultado de la cantidad del recargo de la cuota por el precio total.
  precioFinal = resultadoCuotas.recargo * precioTotal;
  //Si precio final es mayor a 0, se le indica cuanto tendría que pagar.
  if (precioFinal > 0) {
    total.placeholder =
      "$" +
      precioFinal +
      " Finales, serían: " +
      resultadoCuotas.nombre +
      " de $" +
      precioFinal / resultadoCuotas.numero;
  }
  //Y si no, el placeholder es igual a "No hay monto".
  else {
    total.placeholder = "No hay monto";
  }
}
function abrirTabla(){
  tabla.classList -= 'd-none';
}
function cerrarTabla(){
  tabla.classList+=' d-none'
}
//Creo una función para abrir un modal.
function abrir() {
  modal.classList -= "modalHide";
  modal.classList += "modalShow";
}
//Creo una función para cerrarlo
function cerrar() {
  modal.classList.remove("modalShow");
  modal.classList.add("modalHide");
}
function paga() {
  //Abro el modal sea que no haya ingresado dato, o lo haya ingresado.
  //Si el precio final es 0 o el indice o value de "metodosPago" es 0, se le indíca al usuario que no hizo ninguna compra.
  if (precioFinal == 0 || metodosPago.selectedIndex == "0" || metodosPago.selectedIndex == "1" && cuotasSeleccionadas.selectedIndex == "0") {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todavía no compró nada y/o no eligío ningun método de pago.'
      })
  } else {
    Swal.fire({
      title: 'Estas seguro?',
      text: "Estas por pagar con "+metodosPago.options[metodosPago.selectedIndex].text+".",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Pagar'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Transacción exitosa',
          'Te llegara un email en unos instantes, gracias por comprar en esta tienda!',
          'success'
        ).then(() => { //Está funcion flecha la encontre por ahí, si usuario apreta OK, se actualiza la página y se borra el storage.
          localStorage.clear();
          precioFinal = 0;
          location.reload();
        })  
      }
    })
    //Borro todo y se realiza la transacción
  }
}
//Si apreta el botón cerrar, se cierra el modal.
cerrarModal.addEventListener("click", () => {
  cerrar();
  cerrarTabla();
  //Si ya se pidio pagar, se reinicia la página.


  /////OPERADOR LOGICO AND


  //Reseteo el contenido texto 
  contenidoTable.innerHTML='';
  contenidoTexto.innerHTML='';
});
