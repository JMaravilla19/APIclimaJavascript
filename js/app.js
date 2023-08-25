/**
 * Los datos se deben enviar de forma ESTRUCTURADA, como la API espera que se los mandes
 * Si estas en una empresa, el equipo de backend te comentan que URLs hay disponibles.
 * Muchas APIs usan el ID porque es una buena forma de monitorear QUIEN utiliza mas recursos
 * Y en base a eso tambien te ayuda a saber a quien podrias cobrarle.
 * 
 */

const container = document.querySelector('.container');
const resultado = document.querySelector('#resultado');
const formulario = document.querySelector('#formulario');


window.addEventListener('load', ()=>{
    formulario.addEventListener('submit', buscarClima);
})


function buscarClima(e){
    e.preventDefault();


    //validar
    const ciudad = document.querySelector('#ciudad').value.trim();
    const pais = document.querySelector('#pais').value;

    if(ciudad === '' || pais === ''){
        mostrarError('Ambos campos son obligatorios');
        return;
    }

    // Consultar API
    constularAPI(ciudad, pais);

    console.log('Buscando el clima...');
}

function mostrarError(mensaje){
    
    const alerta = document.querySelector('.bg-red-100');

    if(!alerta){
        const alerta = document.createElement('DIV');
    
        alerta.classList.add('bg-red-100', 'border-red-400','text-red-700','px-4','py-3','rounded', 'max-w-md', 'mx-auto', 'mt-6', 'text-center')

        alerta.innerHTML = `
        <strong class="font-bold">Error!</strong>
        <span class="block"> ${mensaje} </span>
        `
        console.log(mensaje);

        container.appendChild(alerta);

        setTimeout(() => {
            alerta.remove()
        }, 5000);
    }
    
}

function constularAPI(ciudad, pais){
    const appID = '1b73d020f4116e73f7542f102ee8cdaf';
    let url = `http://api.openweathermap.org/geo/1.0/direct?q=${ciudad},${pais}&limit=1&appid=${appID}`
    
    fetch(url)
        .then((respuesta)=>{
            return respuesta.json();
        })
        .then( (resultado)=>{
            consultarSegundaAPI(resultado[0].lat, resultado[0].lon, appID)

        } )
        .catch((error)=>{
            if (error) {
                mostrarError('Error, Ciudad no encontrada');
                formulario.reset();
            }
        })
}

function consultarSegundaAPI(lat, lon, appID){

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appID}`

    fetch(url)
        .then( (resultado) => {
            return resultado.json();
        })
        .then( (datos)=>{
            console.log(datos);
        } )
}