//Creo variables globales
let precio = 0;
let unidad = 0;
let precioTotal = 0;
let precioFinal = 0;
let precioConRecargo = 0;
let resultado;
let resultadoMetodo;
let i = 0;
let respuesta;
//Tomo id/queryselectors de los forms
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
let informacion = document.getElementById("informacion");
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
setTimeout(() => {
  if (
    localStorage.getItem("carrito") != null ||
    localStorage.getItem("precioTotal") != null
  ) {
    carrito = JSON.parse(localStorage.getItem("carrito"));
    precioTotal = JSON.parse(localStorage.getItem("precioTotal"));
    total.placeholder = "$" + precioTotal;
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "success",
      title: "Se ha cargado el carrito!",
    });
  } else {
    carrito = [];
    precioTotal = 0;
  }
}, 800);
//Función de reseteo de var e index
function reseteo() {
  unidad = 0;
  unidades.value = "";
  metodosPago.selectedIndex = "0";
  cuotasSeleccionadas.selectedIndex = "0";
  cuotasSeleccionadas.style.display = "none";
}
//Función aviso de carro vacío
function carritoVacio() {
  Swal.fire({
    position: "top-end",
    icon: "error",
    title: "No hay elementos en el carrito",
    showConfirmButton: false,
    timer: 1500,
  });
}
//Muestra total si es mayor a 0, si no, se imprime no hay monto.
function zero(param1) {
  param1 > 0
    ? (total.placeholder = "$" + decimal(precioFinal))
    : (total.placeholder = "No hay monto");
}
//Funcion que solo muestra 2 decimales
function decimal(num) {
  return num.toFixed(2);
}
//Funcion que muestra precio
function mostrarPrecio() {
  resultado = productosMarket.find(
    (productosMarket) =>
      productosMarket.nombre === productos.options[productos.selectedIndex].text
  );
  precio = resultado.precio;
  precioProductos.placeholder = "$" + precio;
}
function tomarUnidad() {
  unidad = unidades.value;
}
//Función que actualiza storage
function actualizarCarroLocalStorage() {
  //Si carrito no tiene nada, se resetea todo.
  if (carrito.length == 0) {
    localStorage.clear();
    reseteo();
    precioTotal = 0;
  }
  //Y si no, se actualiza
  else {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("precioTotal", JSON.stringify(precioTotal));
  }
}
//BOTON INFORMACIÓN DE FRUTAS/VERDURAS
informacion.addEventListener("click", () => {
  //Si el index del select es igual a 0, se le informa que no se eligio producto
  if (productos.selectedIndex == 0) {
    Swal.fire({
      position: "top-center",
      icon: "error",
      title: "No se eligió ningún producto",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  //Y si no, se le muestra la info.
  else {
    //Se realiza un fetch al data.json con los datos de los productos.
    fetch(`/data.json`)
      .then((response) => {
        //Si la respuesta es diferente de response.ok, se lanza un nuevo error, mostrando el response con el texto error.
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        //Si no, se returna response
        return response.json();
      })
      //Si hay error, se le indica que no hubo respuesta.
      .catch((error) => {
        Swal.showValidationMessage(`Falló la solicitud: ${error}`);
      })
      //Y si hubo resultado, y ademas el result tiene 6 array, se ejecuta el swal con la info del producto elegido por select.
      .then((result) => {
        if (result.length == 6) {
          Swal.fire({
            imageUrl: `${result[productos.selectedIndex - 1].img}`,
            imageHeight: 80,
            imageWidth: 100,
            title: `${result[productos.selectedIndex - 1].nombre}`,
            text: `Tipo: ${
              result[productos.selectedIndex - 1].tipo
            }, Carbohidratos: ${
              result[productos.selectedIndex - 1].carbohidratos
            }, Azúcares: ${result[productos.selectedIndex - 1].azucares}`,
          });
        }
      });
  }
}); //FIN

//Sube al carrito las unidades de los productos y los sube al Local Storage
function subirAlCarro() {
  //creo una constante que verifique si el elemento ya existe en el carrito con find.
  const duplicado = carrito.some((elemento) => elemento.ID === resultado.ID);
  //Si el resultado es false se ejecuta el código dentro.
  if (duplicado == false) {
    //La unidad de resultado va a ser lo que haya en unidad
    resultado.unit = parseInt(unidad);
    //Luego se sube el dato al carrito.
    carrito.push(resultado);
  } else {
    //y si es true, busco donde está el index del elemento encontrado.
    let modificar = carrito.findIndex(
      (elemento) => elemento.ID == resultado.ID
    );
    //console.log(modificar);  //Verifico
    //Lo busco en los array del carrito, y le sumo solamente las unidades.
    carrito[modificar].unit += parseInt(unidad);
  }
  //Subo el carrito al localStorage con su lenguaje a partir de JSON.
  localStorage.setItem("carrito", JSON.stringify(carrito));
  //Verificación
  Swal.fire({
    position: "top-end",
    icon: "success",
    title: "Se han añadido los productos al carrito",
    showConfirmButton: false,
    timer: 1500,
  });
}
//SE AGREGA AL CARRO CON TECLA ENTER
function agregarAlCarro(event) {
  x = event.key;
  x == "Enter" && agregar();
}
//FUNCION QUE AGREGA AL CARRO O DA AVISO SI NO HAY DATO.
function agregar() {
  //Si no hay producto elegido, se le avisa que no eligio uno.
  if (productos.selectedIndex == "0") {
    Swal.fire({
      position: "top-middle",
      icon: "error",
      title: "No ha elegido un producto",
      showConfirmButton: false,
      timer: 1500,
    });
  }
  //Y si eligió producto, pero no ingreso un digito del 1 al 10, o directamente no ingreso nada, se le avisa
  else if (unidad <= 0 || unidad > 10 || unidad % 1 != 0) {
    unidad = 0;
    unidades.value = undefined;
    Swal.fire({
      position: "top-middle",
      icon: "error",
      title: "Ha ingresado un dato inválido.",
      text: "Solo se pueden ingresar de 1 a 10 unidades.",
      showConfirmButton: false,
      timer: 1700,
    });
  }
  //y si no, se sube el dato al carro.
  else {
    //Subo el dato al carro.
    subirAlCarro();
    //El precio total es el precio tomado del array, por la unidad tomado por input.
    precioTotal += precio * unidad;
    //Se muestra precio total en el input total
    total.placeholder = "$" + precioTotal;
    //Subo el total al storage
    localStorage.setItem("precioTotal", JSON.stringify(precioTotal));
    //Se resetea valor del input "unidad"
    reseteo();
  }
}
function actualizarCarrito() {
  contenidoTable.innerHTML = ``;
  i = 0;
  for (const producto of carrito) {
    contenidoTable.innerHTML += ` <tr>
    <th scope="row"></th>
    <td>${producto.nombre}</td>
    <td>${producto.precio}</td>
    <td>${producto.unit}</td>
    <td><button type="button" id="botonEliminar" value="${i++}" onclick="eliminarProductos()" class="btn btn-primary btn-eliminar">X</button></td>
   </tr>
   `;
  }
}
/////Function ver carrito//////
function verCarrito() {
  //Si el vacio está vacio, se llama a una función que contiene un swal.fire avisando a usuario que no hay
  //elementos en el carro.
  if (carrito.length == 0) {
    carritoVacio();
  } else {
    //Y si no, se le muestra el modal de productos al usuario
    //Abro modal
    abrir();
    //por cada producto dentro de carrito, muestro los datos por innerHTML
    actualizarCarrito();
  }
}
//Creo una función para abrir el modal del carrito
function abrir() {
  modal.classList -= "modalHide";
  modal.classList += "modalShow";
}
//Creo una función para cerrarlo
function cerrar() {
  modal.classList.remove("modalShow");
  modal.classList.add("modalHide");
}
//Funcion que elimina productos del modal carrito.
function eliminarProductos() {
  //Invoco a las clases con queryS
  let eliminarElemento = document.querySelectorAll(".btn-eliminar");
  //Creo una funcion para eliminar productos.
  const valueBtn = function (evento) {
    //Si la unidad del producto en el carro es 1 y se presiona valueBtn, se ejecuta el código.
    if (carrito[this.value].unit == 1) {
      //Se le resta una vez o las veces que se aprete el botón eliminar el precio del producto
      precioTotal -= carrito[this.value].precio;
      //Se actualiza el precio.
      total.placeholder = "$" + precioTotal;
      //Se eliminar del carro el elemento.
      carrito.splice(this.value, 1);
      //Si el carro no tiene nada, se cierra el modal.
      if (carrito.length == 0) {
        cerrar();
      }
    } else {
      carrito[this.value].unit -= 1;
      precioTotal -= carrito[this.value].precio;
      total.placeholder = "$" + precioTotal;
    }
    //Se actualizan los carros tanto locales como en el storage.
    actualizarCarrito();
    actualizarCarroLocalStorage();
  };
  //Por cada boton de eliminarElemento le agrego un eventListener.
  eliminarElemento.forEach((boton) => {
    boton.addEventListener("click", valueBtn);
  });
}
function vaciarCarrito() {
  console.log(carrito);
  if (carrito.length == 0) {
    carritoVacio();
  } else {
    //Reseteo las var para que el precio total se ponga en 0
    precioTotal = 0;
    precioFinal = 0;
    reseteo();
    total.placeholder = "$" + precioTotal;
    //Elimino los datos del array con un for.
    for (let i = carrito.length; i > 0; i--) {
      carrito.pop();
    }
    localStorage.clear();
    contenidoTable.innerHTML = ``;
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Se ha vaciado el carrito",
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
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
    cuotasSeleccionadas.selectedIndex = 0;
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
    precioConRecargo = precioFinal / resultadoCuotas.numero;
    total.placeholder =
      "$" +
      precioFinal +
      " Finales, serían: " +
      resultadoCuotas.nombre +
      " de $" +
      decimal(precioConRecargo);
  }
  //Y si no, el placeholder es igual a "No hay monto".
  else {
    total.placeholder = "No hay monto";
  }
}
function paga() {
  //Abro el modal sea que no haya ingresado dato, o lo haya ingresado.
  //Si el precio final es 0 o el indice o value de "metodosPago" es 0, se le indíca al usuario que no hizo ninguna compra.
  if (
    precioFinal == 0 ||
    metodosPago.selectedIndex == "0" ||
    (metodosPago.selectedIndex == "1" &&
      cuotasSeleccionadas.selectedIndex == "0")
  ) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Todavía no compró nada y/o no eligío ningun método de pago.",
    });
  } else {
    Swal.fire({
      title: "Estas seguro?",
      text:
        "Estas por pagar con " +
        metodosPago.options[metodosPago.selectedIndex].text +
        ".",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Pagar",
    }).then((result) => {
      if (result.isConfirmed) {
        (async () => {
          //Valido el email que se ingresa
          const { value: email } = await Swal.fire({
            title: "Input email address",
            input: "email",
            inputLabel: "Your email address",
            inputPlaceholder: "Enter your email address",
          });
          let requestOptions = {
            method: "GET",
            redirect: "follow",
          };
          //Doble filtro para saber si realmente es un email válido
          fetch("https://www.disify.com/api/email/" + email, requestOptions)
            .then((response) => response.json())
            .then((result) => {
              if (result.dns == false) {
                Swal.fire({
                  position: "top-middle",
                  icon: "error",
                  title: "Error",
                  text: "El email no es válido, intentelo nuevamente.",
                  showConfirmButton: false,
                  timer: 1700,
                });
              } else {
                //Se le indica que se envió un mail.
                Swal.fire({
                  position: "top-middle",
                  icon: "success",
                  title: "Exito",
                  text:
                    "Se ha enviado un mail a "+email+" con el código de pago para pagarlo con " +
                    metodosPago.options[metodosPago.selectedIndex].text,
                  showConfirmButton: false,
                  timer: 2500,
                });
                //Borro todo
                setTimeout(() => {
                  reseteo();
                  localStorage.clear();
                  location.reload();
                }, 2600);
              }
            })
            .catch((error) =>
              Swal.fire({
                position: "top-middle",
                icon: "error",
                title: "Error",
                text: error,
                showConfirmButton: false,
                timer: 1700,
              })
            );
        })();
      }
    });
  }
}
//Si apreta el botón cerrar, se cierra el modal.
cerrarModal.addEventListener("click", () => {
  cerrar();
  //Si ya se pidio pagar, se reinicia la página.
  //Reseteo el contenido texto
  contenidoTable.innerHTML = "";
  contenidoTexto.innerHTML = "";
});
