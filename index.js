require('dotenv').config()

const {leerInput,
      inquirerMenu,
      inquirerpausa,
      listarLugares } = require('./helpers/inquirer');
const { Busquedas } = require('./models/busquedas')


console.clear();
const main = async () => {

  const busquedas = new Busquedas();
  let opt = null;

  do {
    busquedas.historialCapitalizado;
    opt = await inquirerMenu();

    switch (opt){
      case 1:

        // Mostrar mensaje
        const termino = await leerInput('Ciudad: ');

        // Buscando los lugares
        const lugares = await busquedas.ciudad( termino );

        // Seleccionar el lugar
        const id = await listarLugares(lugares);
        if(id === '0')continue;
        const lugarSel = lugares.find( l => l.id === id );

        //Guardar en DB
        busquedas.agregarHistorial(lugarSel.nombre)

        const lat = lugarSel.lat;
        const lng = lugarSel.lng;

        //Clima
        const clima = await busquedas.climaLugar(lat, lng);

        // Resultados de la Busqueda
        console.log('\n Informacion de la ciudad \n'.green);
        console.log('Ciudad: ', lugarSel.nombre);
        console.log('Lat: ',lat);
        console.log('Lng: ',lng);
        console.log('Temperatura: ',clima.temp);
        console.log('Minima: ',clima.min);
        console.log('Maxima ',clima.max);
        console.log('Como esta el clima: ',clima.desc);

        break;
      case 2:
        // busquedas.historial.forEach((lugar, i) => {
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i +1 }.`.green;
          console.log(`${idx} ${lugar}`)
        })
        break;


    }

  await inquirerpausa();
  }while (opt !== 0)


};


main();