// Clase "Producto" para almancenar los servicios ofrecidos
class Producto{
    constructor(nombre, precio){
    this.nombre = nombre;
    this.precio = parseFloat(precio);
    }
};

// Variable por cada servicio ofrecido
const producto0 = new Producto("Productos",0)
const producto1 = new Producto("Tasa", 1000);
const producto2 = new Producto("Remera", 2500);
const producto3 = new Producto("Plato", 2350);
const producto4 = new Producto("Vaso", 1300);
const producto5 = new Producto("Gorra", 1200);
const producto6 = new Producto("Mate", 3000);

// Array para contener todos los productos
const listadoProductos = [producto0, producto1, producto2, producto3, producto4, producto5, producto6];

// Elementos usados por js
const listado = document.getElementById("listado");
const inputPresu = document.getElementById("valor");
const resultado = document.getElementById('resultado');
const ultimoPresupuesto = document.querySelector('#ultimo');
const items = document.querySelector("#items");

// Crea el elemento "select"
const selectList = document.createElement("select");
// Agrega al elemento "listado" el elemento anteriormente creado
listado.appendChild(selectList);

// Crea el elemento "option" y le agrega todos los nombres de los productos indicados en el array "listadoProductos". Agrega el elemento "option" al elemento "selecList"
for (const producto of listadoProductos) {
    let option = document.createElement("option");
    option.value = producto.nombre;
    option.text = producto.nombre;
    selectList.appendChild(option);
}

// Evento "change" que al seleccionar una variable de la selectList, regresa la función "precioFinal"

selectList.addEventListener('change', precioFinal);
inputPresu.addEventListener('input', precioFinal);

// Busca la cotización del dolar y la asigna a una variable. En caso de error multiplica por 1 para dar el precio en AR$.
let valorDolar = ""
$.ajax({ 
    url: "https://criptoya.com/api/dolar",
    success: function (result){
        valorDolar = result.ccl
    },
    error: 1
    })


//Calcular el precio final en U$D
function precioFinal() {
    const itemFind = listadoProductos.find((producto) => producto.nombre === selectList.value); 
    let cotiza = (itemFind.precio/valorDolar)*Number(inputPresu.value); 
        if (itemFind.nombre === producto0.nombre){
            (resultado.textContent = `Por favor, seleccione un servicio`) 
        }
        else if (inputPresu.value === "" || isNaN(inputPresu.value)){
            (resultado.textContent = "Por favor, ingrese un monto") 
        }
        else{
            resultado.textContent = `El precio será de U$D ${cotiza.toLocaleString()}` 
        }
    return cotiza
}

$("#agregar").click(agregar)// Se crea el evento "click" para almanacenar el resultado en localStorage
$('#valor').keypress((enter) =>{if (enter.which == 13){agregar()}}) // Habilita que al presional "enter" se agregue al carrito

// Crea carrito como objeto
let carrito = []

// Agrega al carrito lo seleccionado
function agregar() {
    let productosSeleccionados = { // Se crea el objeto "productoSeleccionados" con las propiedades nombre y precio que se completan con el valor seleccionado y completado por el usuario, respectivamente.
        nombre : selectList.value,
        precio : precioFinal(),
        cantidad : Number(inputPresu.value),
        pokemon : clickPokemon().toUpperCase(),
    }
    if (carrito === null){
        carrito = []
    }
    if(inputPresu.value !== "" || listado === producto0 || productosSeleccionados.pokemon !== ""){
        const existe = carrito.some( 
            producto => producto.nombre === productosSeleccionados.nombre);
            const repetido = carrito.some (
                producto => producto.pokemon === productosSeleccionados.pokemon)
                
                // Verifica (retornando con un booleano) si el producto existe -o no- en el carrito. Si existe, suma a lo que ya existe
                function estaEnCarrito(productosSeleccionados){
                    for(let i =0; i < carrito.length ; i++){
                        if(
                            carrito[i].nombre === productosSeleccionados.nombre && 
                            carrito[i].pokemon === productosSeleccionados.pokemon
                            ){
                            carrito[i].cantidad = 
                                Number(productosSeleccionados.cantidad) + 
                                Number(carrito [i].cantidad);
                            carrito[i].precio = Number(
                                productosSeleccionados.precio * carrito[i].cantidad
                                );
                            return true
                            }
                        }
                    return false;
                }
        // Si existe (el producto) y se encuentra (el Pokemon) valida si se suma a lo ya existente uno igual o si se crea uno nuevo.
        // De no existir pokemon y producto, crea nuevo. 
        if (existe && repetido){
            if (!estaEnCarrito(productosSeleccionados)){
                carrito.push(productosSeleccionados)
            }}
        else{
            carrito.push(productosSeleccionados)
        }
        $('#valor').val('')
        $('#input-pokemon').val('')
        guardarStorage()
        mostrarCarrito()
    }}

// Carga el carrito de la sesión anterior y si existe contenido, lo muestra
document.addEventListener('DOMContentLoaded',() =>{
    carrito = JSON.parse(localStorage.getItem('carrito'));
    
    if (carrito.some(producto => producto.nombre)){mostrarCarrito()}
});


// Almacena en JSON lo agregado
function guardarStorage(){
    localStorage.setItem('carrito', JSON.stringify(carrito)); 
}

// Muestra el carrito
function mostrarCarrito(){
    if (carrito === null){
        borrarCarrito()
    }
    else {
        $('#enviados').show(1000); 
        items.innerHTML= ''
        carrito.forEach(producto =>{
            const {nombre, cantidad, precio, pokemon} = producto;
            $('#items').append(`
            <tr>
            <td>${pokemon}</td>
            <td>${nombre}</td>
            <td>${cantidad}</td>
            <td>${precio.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
            </tr>
            </table>`
);})}}


// Al hacer click en el boton "Borrar Carrito", borra el carrito
$('#borrar_carrito').click(borrarCarrito)

// Borra el carrito en el LocalStorage y el HTML
function borrarCarrito(){
    carrito = []
    items.innerHTML = ''
    guardarStorage()
    $('#enviados').hide(1000);
    $('#ejemplo-pokemon').show(2000)
}


// Uso de animación para mostrar todos los trabajos. La función realiza un recorrido por toda la pantalla (subiendo y bajando)
$('#productos').click((e) =>{
    e.preventDefault();
    $('html, body').animate({
        scrollTop: $('#final').offset().top
    }, 5000)
    .animate({
        scrollTop: $('#titulo').offset().top
    }, 1000)
})

// En caso scroll con el mouse, deja de ejecutar el scrollTop
$("html, body").bind("mousewheel DOMMouseScroll", () => {
    $('html, body').stop();
});


// Crea un array con el listado de Pokémon existentes
const nombresPokemon = []
$.ajax({
    url: `https://pokeapi.co/api/v2/pokemon?offset=0&limit=151`,
    dataType: 'json',
    success: function(data) {
        const datosCrudosPokemon = Object.values(data).slice(3)[0]
        datosCrudosPokemon.forEach(pokemon => nombresPokemon.push(pokemon.name.toUpperCase()))
        
    }
})

// Habilita el autocompletar con en array de Pokemon (nombrePokemon) creado con ajax.
$('#input-pokemon').autocomplete({
    source : nombresPokemon
})

// Crea la función para buscar y devolver un Pokémon en función de lo ingresado por el usuario. En caso de no existir el personaje (error 404), devuelve un mensaje en pantalla. 
function clickPokemon() {
    let pokemonElegido = $('#input-pokemon').val().toLowerCase();
    if (pokemonElegido !== ""){
    $('#ejemplo-pokemon').hide(2000)
    $('#resultado-pokemon').slideUp(2000)
    $.ajax({
        url: `https://pokeapi.co/api/v2/pokemon/${pokemonElegido}`,
        dataType: 'json',
        success: function(data) {
            $('#resultado-pokemon').empty().append(`
            <section>Seleccionaste a ${pokemonElegido.toUpperCase()} y es de tipo ${data.types[0].type.name.toUpperCase()}.</section>
            <img src="https://pokeres.bastionbot.org/images/pokemon/${data.id}.png" alt="" srcset="" class="imagen">
            `).slideDown (2000);
        },
        error: ()=>{
            $('#resultado-pokemon').empty().append(`
            <section>Ud. ingresó un Pokémon incorrecto. Por favor, vuelva a intentarlo.</section>`).slideDown(2000);
        },
    }
    )
        return pokemonElegido
    } else {
        return ""
    }
}

// Habilita la opción de ir al inicio de la página al hacer click en el boton
$("#myBtn").click(()=> {
    $("html, body").animate(
        {scrollTop: 0
        }, 1000);
    });

// Muestra el boton de "Inicio" para ir al inicio de la página.
window.onscroll = () => { scrollFunction() };
function scrollFunction() {
    if (document.documentElement.scrollTop > 20) {
        $('#myBtn').show();
    } else {
        $('#myBtn').hide();
    }
}