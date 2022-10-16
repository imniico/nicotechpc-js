let minmax = document.getElementById("minmaxcarrito");
let visual = document.querySelector(".visual-carrito");

minmax.addEventListener("click", () => {
    if (visual.style.display == "none" || visual.style.display == "" ){
        visual.style.display = "block";
    }
    else{
        visual.style.display = "none";
    }
})


// CERRAR CARRITO
let cerrar_carrito = document.getElementById("cerrar");

cerrar_carrito.addEventListener("click", () => {
    visual.style.display = "none";
})

// BOTONES AGREGAR
let botones_agregar = document.querySelectorAll(".agregar-producto");

for (btn of botones_agregar){
    btn.addEventListener("click", add);
}

function add(e){
    let hijo = e.target;
    let padre = hijo.parentNode;
    let abuelo = padre.parentNode;

    let nombre = abuelo.querySelector(".card-header").querySelector("h4").textContent;
    let precio = padre.querySelector(".card-title").querySelector("em").textContent;
    let img = padre.querySelector(".img-carrito").querySelector("img").src;

    let visual = document.querySelector(".visual-carrito");

    let div = document.createElement("div");
    div.innerHTML = `<div class="fila">
               <div><img src="${img}" alt=""></div>
               <div><p class="nombreprod">${nombre}</p></div>
               <div><p class="precioprod">${precio}</p></div>
               <div><button class="eliminar">X</button></div>
               </div>`;

    visual.append(div);
    calcular_total(parseInt(precio));
    incrementar_carrito();
    actualizar_btneliminar();

    Toastify({
        text: "Agregado al carrito!",
        duration: 1000, 
        close: true, 
        gravity: "top", 
        position: "right", 
        stopOnFocus: true, 
        style: { background: "linear-gradient(to right,#00b09b, #96c93d)" }        
    }).showToast();
}

// BOTONES ELIMINAR
function actualizar_btneliminar(){
    let botones_eliminar = document.querySelectorAll(".eliminar");
    for (btn of botones_eliminar){
        btn.addEventListener("click", remove);
    }
}

function remove(e){
    let hijo = e.target;
    let padre = hijo.parentNode;
    let abuelo = padre.parentNode;
    let precio = parseInt(abuelo.querySelector(".precioprod").innerHTML);

    abuelo.remove();
    calcular_total(-parseInt(precio));
    decrementar_carrito();
}

// CALCULAR TOTAL
function calcular_total(precio){
    let total = document.getElementById("total").querySelector("em");
    let suma = parseInt(total.innerHTML) + precio;
    total.innerHTML = suma;
    
}

// CONTADOR CARRITO
function incrementar_carrito(){
    let contador = document.getElementById("contador-carrito");
    contador.innerHTML = parseInt(contador.innerHTML) + 1;
}

function decrementar_carrito(){
    let contador = document.getElementById("contador-carrito");
    contador.innerHTML = parseInt(contador.innerHTML) - 1;
}


// BOTON COMPRAR

let btn_comprar = document.querySelector(".comprar");
btn_comprar.addEventListener("click", comprar);

function comprar(){
    let productos = document.querySelectorAll(".fila");
    let array_productos = [];

    for (p of productos){

        let prod = {img: p.querySelector("img").src, 
                    nombre: p.querySelector(".nombreprod").textContent,
                    precio: p.querySelector(".precioprod").textContent }

        array_productos.push(prod);
    }

    if (array_productos.length == 0){
        Toastify({
            text: "Carrito vacío!",
            duration: 1000, 
            close: true, 
            gravity: "top", 
            position: "right", 
            stopOnFocus: true, 
            style: { background: "linear-gradient(to right, #b00f00, #ae6a64)" }        
        }).showToast();
    }
    else{
        
        Swal.fire({
            title: '¿Desea proceder al pago?',
            showDenyButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        }).then((result) => {
            if (result.isConfirmed) {
                let arrayprodJSON = JSON.stringify(array_productos);
                localStorage.setItem("productos", arrayprodJSON);
                window.location.href = "pago.html";
            }
        })
    }
}