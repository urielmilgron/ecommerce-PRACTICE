# ecommerce-PRACTICE
# Programa realizado con HTML, CSS con Sass y Boostrap, y para el ecommerce, funciones: Javascript.

# En un principio la interfaz es sumamente sencilla, aunque se piensa actualizar en el futuro

# Los productos están dentro del select, cada uno tiene diferente precio

# En el input de unidades se ingresa solo hasta el número 10.

# Con la tecla "enter" o el botón agregar al carrito se puede agregar las unidades al carrito

# Cada unidad tiene su precio que cambia en el input "Precio"

# El precio total se muestra en el input "Precio", este cambia cuando se elige un método de pago

# Se puede ver carrito pulsando "Ver carrito", se actualiza cada vez que se agrega más unidades de la misma verdura/fruta, o una nueva.

# El modal que da la información de carrito, y pago es el mismo pero con diferente contenido modificado desde JS

# Cuando se añaden productos al carrito, se guarda tanto esto ultimo como el precio total de lo que lleva el usuario para pagar al LocalStorage, al actualizar la página quedan los datos guardados si es que no presiono "Vaciar Carrito" antes de actualizar.

# Los métodos de pago se encuentran en el select "Métodos de pago", cada método tiene un recargo o descuento, dependiendo cual elija el usuario. Si elige "Tarjeta de credito", se hace visible un select con las cuotas disponibles para el pago, con el recargo correspondiente.

# Al clickear pagar, se le indica que la transacción ha sido exitosa a traves de un modal. Si no hay monto y clickea pagar, se le indica que todavia no ingreso monto o forma de pago y ademas en el contenido del input "Total" aparece la frase "No hay monto".

