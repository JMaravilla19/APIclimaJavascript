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
    
    spinner(); //muestra spinner de carga

    fetch(url)
        .then((respuesta)=>{
            return respuesta.json();
        })
        .then( (resultado)=>{
            consultarSegundaAPI(resultado[0].lat, resultado[0].lon, appID)

        } )
        .catch((error)=>{
            if (error) {
                 limpiarHTML();
                mostrarError('Ciudad no encontrada');
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
             limpiarHTML();
            mostrarDatos(datos);
        } )
        .catch( (error) =>{
             mostrarError(`Error: ${error}`);
        })
}

function mostrarDatos(datos){
    //La temperatura se muestra en grados kelvin, para hacer la conversion:
    // Celcius: temp - 273.15
    const {name, main: { temp, temp_max, temp_min }} = datos;

    const centigrados = kelvinACent(temp);
    const max = kelvinACent(temp_max);
    const min = kelvinACent(temp_min);
    
    // Temperatura Actual
    const actual = document.createElement('P');
    actual.innerHTML = `${centigrados}&#8451`;
    actual.classList.add( 'font-bold', 'text-6xl' );

    //Temperatura Maxima
    const tempMaxima = document.createElement('P');
    tempMaxima.innerHTML = `Temp Maxima: ${max}&#8451`;
    tempMaxima.classList.add('text-xl');

    //Temperatura Minima
    const tempMinima = document.createElement('P');
    tempMinima.innerHTML = `Temp Minima: ${min}&#8451`;
    tempMinima.classList.add('text-xl');

    // Nombre Ciudad
    const nombreCiudad = document.createElement('P');
    nombreCiudad.textContent = `Clima en: ${name}`;
    nombreCiudad.classList.add('font-bold', 'text-2xl')

    const resultadoDiv = document.createElement('DIV');
    resultado.classList.add('text-center', 'text-white' )
    resultadoDiv.appendChild(actual);
    resultadoDiv.appendChild(tempMaxima);
    resultadoDiv.appendChild(tempMinima);
    resultadoDiv.appendChild(nombreCiudad);

    resultado.appendChild(resultadoDiv);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

const kelvinACent = grados => parseInt(grados - 273.15)

function spinner(){
    limpiarHTML();
    const divSpinner = document.createElement('DIV');
    divSpinner.classList.add('sk-chase')

    divSpinner.innerHTML = `
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
            <div class="sk-chase-dot"></div>
    `;

    resultado.appendChild(divSpinner);
}