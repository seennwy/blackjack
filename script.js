let botonCrearPartida = document.getElementById("botonCrearPartida");

let botonesJugador = document.getElementsByClassName("botonesJugador");
let botones = document.getElementsByClassName("botones");
let botonPedirCarta = document.getElementById("botonPedirCarta");
let botonPlantarse = document.getElementById("botonPlantarse");

let puntosJugadorInterfaz = document.getElementById("puntosJugador");
let winsJugadorInterfaz = document.getElementById("partidasGanadas");
let winsBancaInterfaz = document.getElementById("partidasGanadasBanca");
let dineroJugadorInterfaz = document.getElementById("dinero");
let cartasJugador = document.getElementById('jugador-cartas');

let cartasBanca = document.getElementById('banca-cartas');
let puntosBancaInterfaz = document.getElementById("puntosBanca");

let marcador = document.getElementById("marcador");
let portada = document.getElementById("portada");

let baraja = [];
let puntosJugador = 0;
let puntosBanca = 0;
let winsJugador = 0;
let winsBanca = 0;
let dineroJugador = 100;
let cantidadAposta = 0;
let apuestaCreada = false;
let victoriaJugador = false;
let victoriaBlackJugador = false;

botonCrearPartida.addEventListener('click', crearPartida);
botonPedirCarta.addEventListener('click', function () {
    insertarCarta('jugador');
});
botonPlantarse.addEventListener('click', plantarse);

marcador.style.display = "none";

function crearPartida() {
    apostar();

    nuevaPartida();

    marcador.style.display = "";

    document.getElementById('jugador-cartas').innerHTML = '<h2>Tus cartas:</h2>';

    for (let i = 0; i < botonesJugador.length; i++) {
        botonesJugador[i].style.display = "inline-block";
    }

    baraja = crearBaraja();
    insertarCarta('jugador');

    dineroJugadorInterfaz.textContent = dineroJugador;
    botonCrearPartida.textContent = "Reiniciar Partida";

}

function nuevaPartida() {
    document.getElementById('jugador-cartas').innerHTML = '';
    document.getElementById('banca-cartas').innerHTML = '';

    for (let i = 0; i < botonesJugador.length; i++) {
        botonesJugador[i].style.display = "inline-block";
        botonesJugador[i].style.pointerEvents = "auto";
        botonesJugador[i].style.opacity = "1";
    }

    puntosJugador = 0;
    puntosBanca = 0;
    puntosJugadorInterfaz.textContent = puntosJugador;
    puntosBancaInterfaz.textContent = puntosBanca;

}

function finalizarPartida() {

    for (let i = 0; i < botonesJugador.length; i++) {
        botonesJugador[i].style.pointerEvents = "none";
        botonesJugador[i].style.opacity = "0.5";
    }

    botonCrearPartida.textContent = "Volver a jugar";

    partidaFinalizada();
}

function plantarse() {
    // Desactivar botones del jugador
    for (let i = 0; i < botonesJugador.length; i++) {
        botonesJugador[i].style.pointerEvents = "none";
        botonesJugador[i].style.opacity = "0.5";
    }

    document.getElementById('banca-cartas').innerHTML = '<h2>Cartas de la banca:</h2>';

    insertarCartaBanca();
}

function insertarCartaBanca() {
    if (puntosBanca < 21 && puntosBanca < puntosJugador) {
        insertarCarta('banca');
        setTimeout(insertarCartaBanca, 500);
    } else {
        finalizarPartida();
    }
}

function crearBaraja() {
    let valores = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    let palos = ['H', 'D', 'C', 'S'];
    let baraja = [];

    for (let valor of valores) {
        for (let palo of palos) {
            baraja.push(valor + palo);
        }
    }

    return _.shuffle(baraja);
}

function insertarCarta(jugador) {

    if (baraja.length === 0) {
        alert('No quedan cartas en la baraja.');
        return;
    }

    let carta = baraja.pop();

    let img = document.createElement('img');
    img.src = `cartas/${carta}.png`;
    img.classList.add('carta');

    if (jugador === 'jugador') {

        cartasJugador.appendChild(img);
        setTimeout(() => {
            let valorCarta = puntosCarta(carta, 'jugador');
            puntosJugador += valorCarta;
            puntosJugadorInterfaz.textContent = puntosJugador;

            if (puntosJugador >= 21) {
                plantarse();
            }
        }, 50);


    } else if (jugador === 'banca') {

        cartasBanca.appendChild(img);
        let valorCarta = puntosCarta(carta, 'banca');
        puntosBanca += valorCarta;
        puntosBancaInterfaz.textContent = puntosBanca;
    }
}


function puntosCarta(carta, usuario) {
    let valor = carta[0];

    if (valor === '1' && carta[1] === '0') {
        valor = '10';
    }

    if (valor === 'A' && usuario === 'jugador') {
        let seleccion = prompt("Elige el valor del AS 1 o 11");
        while (seleccion !== '1' && seleccion !== '11') {
            seleccion = prompt("Valor no valido, elige 1 o 11");
        }
        valor = seleccion;
    } else if (valor === 'A' && usuario === 'banca') {
        valor = Math.random() < 0.5 ? 1 : 11;
    }

    if (['J', 'Q', 'K'].includes(valor)) {
        valor = 10;
    }

    return parseInt(valor);
}

function partidaFinalizada() {

    setTimeout(() => {
        if (puntosJugador > 21 && puntosBanca > 21) {
            if (puntosJugador < puntosBanca) {
                winsJugador++;
                victoriaJugador = true;
                dineroJugador += cantidadAposta * 1.5;
            } else {
                winsBanca++;
            }
        } else if (puntosJugador === 21 && puntosBanca !== 21) {
            winsJugador++;
            victoriaBlackJugador = true;
            dineroJugador += cantidadAposta * 2;
        } else if (puntosBanca === 21 && puntosJugador !== 21) {
            winsBanca++;
        } else if (puntosJugador > 21 && puntosBanca <= 21) {
            winsBanca++;
        } else if (puntosBanca > 21 && puntosJugador <= 21) {
            winsJugador++;
            victoriaJugador = true;
            dineroJugador += cantidadAposta * 1.5;
        } else if (puntosJugador === puntosBanca) {
            winsBanca++;
        } else if (puntosJugador > puntosBanca) {
            winsJugador++;
            victoriaJugador = true;
            dineroJugador += cantidadAposta * 1.5;
        } else {
            winsBanca++;
        }        

        winsJugadorInterfaz.textContent = winsJugador;
        winsBancaInterfaz.textContent = winsBanca;
        dineroJugadorInterfaz.textContent = dineroJugador;

        notificacionApuesta();
    
    if (dineroJugador === 0) {
        for (let i = 0; i < botones.length; i++) {
            botones[i].style.pointerEvents = "none";
            botones[i].style.opacity = "0.5";
        }
        alert("No tienes dinero no puedes jugar mas");
    }
}, 50);
}


function apostar() {

    let estadoApuesta = prompt("¿Quieres apostar? Responde con: 'si o 'no'").toLowerCase();

    if (estadoApuesta == 'si' && dineroJugador > 0) {
        apuestaCreada = true;
        cantidadAposta = prompt("¿Cuanto quieres apostar?");

        while (isNaN(cantidadAposta) || cantidadAposta === "" || cantidadAposta === null) {
            cantidadAposta = prompt("Introducce un valor numerico");
        }

        while (cantidadAposta > dineroJugador) {
            cantidadAposta = prompt("Te has pasado solo tienes: " + dineroJugador + "€");
        }

        alert("Apuesta de " + cantidadAposta + "€ realizada, comienza el juego");

        dineroJugador -= cantidadAposta;
        dineroJugadorInterfaz.textContent = dineroJugador;
    } else if (dineroJugador <= 0) {
        alert("No tienes dinero");
    } else {
        alert("Apuesta no realizada, comienza el juego")
    }
}

function notificacionApuesta() {
    if (apuestaCreada) {
        if (victoriaJugador) {
            alert("Has ganado: " + cantidadAposta * 1.5 + "€");
        } else if (victoriaBlackJugador) {
            alert("Has ganado: " + cantidadAposta * 2 + "€");
        } else {
            alert("Gana la banca, pierdes: " + cantidadAposta + "€");
        }
    } else {
        if (victoriaJugador || victoriaBlackJugador) {
            alert("Has ganado");
        } else {
            alert("Gana la banca");
        }
    }
}