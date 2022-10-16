// Calcular pagos en cuotas sobre un monto determinado para una cantidad de usuarios ingresada

// Clase Usuario
class Usuario {

    constructor(nombre, total, cuotas, titular, nrotarjeta, fechavenc, cvc) {
        this.nombre = nombre;
        this.total = total;
        this.cuotas = cuotas;
        this.monto_cuota = 0;
        this.monto_final = 0;

        this.titular = titular;
        this.nrotarjeta = nrotarjeta;
        this.fechavenc = fechavenc;
        this.cvc = cvc;
    }

    calcular_cuotas() {
        
        let interes;

        if (this.cuotas <= 1) { interes = 1; }
        else if (this.cuotas <= 5) { interes = 1.1; }
        else if (this.cuotas <= 11) { interes = 1.5; }
        else { interes = 1.85; }

        this.monto_final = (this.total * interes).toFixed(2);
        this.monto_cuota = ((this.total * interes) / this.cuotas).toFixed(2);
    }

}

function cambio_dolar(){
    let contenedor = document.getElementById("cambio-dolar");
    if (contenedor.style.height == "0px"){
        contenedor.style.height = "200px";
        contenedor.style.display = "block";

    }
    else{
        contenedor.style.display = "none";
        contenedor.style.height = "0px";
    }
}

function actualizar_cambio_dolar(){

    let do_compra = document.getElementById("do-compra");
    let do_venta = document.getElementById("do-venta");
    let db_compra = document.getElementById("db-compra");
    let db_venta = document.getElementById("db-venta");

    fetch("https://www.dolarsi.com/api/api.php?type=valoresprincipales")
    .then((response) => response.json())
    .then((data) => {
        do_compra.innerText = data[0].casa.compra;
        do_venta.innerText = data[0].casa.venta;
        db_compra.innerText = data[1].casa.compra;
        db_venta.innerText = data[1].casa.venta;

        let total_dolar = document.querySelector("#total-dolar");
        total_dolar.innerHTML = "U$D" + (total/parseInt(data[1].casa.venta)).toFixed(2);
    })

}

// RESUMEN del PEDIDO y cálculo del TOTAL.
let resumen = document.querySelector(".pedido").querySelector(".card").querySelector(".card-body");
let arrayJSON = JSON.parse(localStorage.getItem("productos"));
let total = 0;

for (det of arrayJSON) {
    detalle = document.createElement("div");
    detalle.innerHTML = `<div class="row detalle">
                            <div class="col-4">
                                <img src="${det.img}" alt="">
                            </div>
                            <div class="col-4">
                                <p>${det.nombre}</p>
                            </div>
                            <div class="col-4">
                                <p>$${det.precio}</p>
                            </div>
                        </div>`;

    total += parseInt(det.precio);
    resumen.append(detalle);
}

let total_pago = document.querySelector("#total-pago");
total_pago.innerHTML = "AR$" + total;

// Tomar los valores de la API
actualizar_cambio_dolar();

// Capturar botones
let boton_pagar = document.getElementById("btn-pagar");
let boton_cuotas = document.getElementById("btn-cuotas");
let boton_dolar = document.getElementById("btn-dolar");

// Funcionalidad de los botones
boton_pagar.addEventListener("click", pagar);
boton_cuotas.addEventListener("click", ver_cuotas);
boton_dolar.addEventListener("click", cambio_dolar);


// FUNCION: PAGAR
function pagar() {
    let nombre = document.getElementById("nombre-usuario");
    let cant_cuotas = document.getElementById("cant-cuotas");
    let titular = document.getElementById("nom-tarjeta");
    let nro = document.getElementById("nro-tarjeta");
    let fechavenc = document.getElementById("fv-tarjeta");
    let cvc = document.getElementById("cvc-tarjeta");
    
    let listaUsuarios;

    Swal.fire({
        title: '¿Esta seguro de realizar el pago?',
        showDenyButton: true,
        confirmButtonText: 'Si',
        denyButtonText: `No`,
    }).then((result) => {
        if (result.isConfirmed) {
            if (validar(nombre.value, cant_cuotas.value, titular.value , nro.value, fechavenc.value, cvc.value)) {

                let usuario = new Usuario(nombre.value, total, cant_cuotas.value);

                let listaUsuariosJSON = localStorage.getItem("usuarios");

                if (listaUsuariosJSON == null) {
                    listaUsuarios = []; //Primera vez
                }
                else {
                    listaUsuarios = JSON.parse(listaUsuariosJSON);
                }

                listaUsuarios.push(usuario);
                localStorage.setItem("usuarios", JSON.stringify(listaUsuarios));
                
                Swal.fire('Pago Realizado!', '', 'success');

                let input_nombre = document.getElementById("nombre-cuotas");
                input_nombre.value = nombre.value;
                ver_cuotas();

                let inicio = document.querySelector(".inicio");
                inicio.style.visibility = "visible";

            }
        }
    })
}

// Validaciones para el ingreso de datos de pago
function validar(nom, cant_cuotas, titular, nro, fechavenc, cvc) {
    let enom = document.getElementById("error-nom");
    let ecuotas = document.getElementById("error-cuotas");
    let etitular = document.getElementById("error-titular");
    let enro = document.getElementById("error-nro");
    let efechavenc = document.getElementById("error-fv");
    let ecvc = document.getElementById("error-cvc");

    let val = true;

    if (nom == "" || !isNaN(nom)) {
        enom.style.display = "block";
        val = false;
    } else {
        enom.style.display = "none";
    }

    if (cant_cuotas == "" || cant_cuotas <= 0 || cant_cuotas >= 24) {
        ecuotas.style.display = "block";
        val = false;
    } else {
        ecuotas.style.display = "none";
    }

    if (titular == "" || !isNaN(titular)) {
        etitular.style.display = "block";
        val = false;
    } else {
        etitular.style.display = "none";
    }

    if(nro == "" || nro.length != 16){
        enro.style.display = "block";
        val = false;
    } else{
        enro.style.display = "none";
    }

    if (fechavenc == "" || new Date(fechavenc) <= new Date()) {
        efechavenc.style.display = "block";
        val = false;
    } else {
        efechavenc.style.display = "none";
    }

    if(cvc == "" || cvc <= 0 || cvc.length != 3){
        ecvc.style.display = "block";
        val = false;
    } else {
        ecvc.style.display = "none";
    }

    if(!val){
        // Toast para comunicar que debe ingresar valores válidos al ingresar usuario
        Toastify({
            text: "Ingrese datos correctos",
            duration: 2000,
            close: true,
            gravity: "bottom",
            position: "right",
            stopOnFocus: true,
            style: { background: "linear-gradient(to right, #b00f00, #ae6a64)" }
        }).showToast();
    }
    
    return val;
}


// FUNCION: VER CUOTAS
function ver_cuotas() {
    let usuario_a_buscar = document.getElementById("nombre-cuotas").value;

    let usuarios = JSON.parse(localStorage.getItem("usuarios"));
    if (usuarios == null){
        // Toast para comunicar cuando no hay usuarios agregados
        Toastify({
            text: "No existen usuarios agregados",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "linear-gradient(to right, #b00f00, #ae6a64)" }
        }).showToast();
        return;
    }

    let usuario_encontrado = usuarios.find((user) => user.nombre === usuario_a_buscar);

    if (usuario_encontrado == undefined) {

        // Toast para comunicar cuando no se encuentra al usuario
        Toastify({
            text: "No se encontró el usuario",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "linear-gradient(to right, #b00f00, #ae6a64)" }
        }).showToast();
    }

    else {
        let user = new Usuario(usuario_encontrado.nombre, usuario_encontrado.total, usuario_encontrado.cuotas);
        user.calcular_cuotas();

        let res_nombre = document.getElementById("nombre");
        let res_total = document.getElementById("total");
        let res_cuotas = document.getElementById("cuotas");
        let res_monto_total = document.getElementById("monto-total");
        let res_monto_cuota = document.getElementById("monto-cuota");

        res_nombre.innerText = "Nombre: " + user.nombre;
        res_total.innerText = "Monto total inicial: " + user.total;
        res_cuotas.innerText = "Cantidad de cuotas: " + user.cuotas;
        res_monto_total.innerText = "Monto total final: " + user.monto_final;
        res_monto_cuota.innerText = "Monto por cuota: " + user.monto_cuota;

        usuarios_filtrados = usuarios.filter((u) => u.nombre != user.nombre)

        usuarios_filtrados.push(user);
        localStorage.setItem("usuarios", JSON.stringify(usuarios_filtrados));

        // Toast para comunicar cuando se encuentra un usuario
        Toastify({
            text: "Usuario encontrado!",
            duration: 2000,
            close: true,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: { background: "linear-gradient(to right, #00b09b, #96c93d)" }
        }).showToast();

    }

}

let btn_inicio = document.getElementById("btn-inicio");
btn_inicio.addEventListener("click", () => {
    window.location.href = "index.html";
})




