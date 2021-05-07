const fs = require('fs');
const axios = require('axios');

class Busquedas {
    historial = []
    dbPath = './db/database.json'

    constructor() {
        this.leerDB();
    }

    get historialCapitalizado(){
        //Capitalizar cada palabra
        for (let i = 0; i < this.historial.length; i++) {
            this.historial[i] = this.historial[i].replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
        }
        return this.historial;

        // return this.historial.map(lugar => {
        //
        //     let palabras = lugar.split(' ');
        //     palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1));
        //
        //     return palabras.join(' ')
        // })
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    async ciudad( lugar = '' ){
        try{
            const instances = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox

            });

            const resp = await instances.get();

            return resp.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],

            }));


        } catch (error){
            return [];
        }

    }


    async climaLugar(lat, lon){
        try {
            const instances = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {
                    'lat': lat,
                    'lon': lon,
                    'appid': process.env.OPENWEATHER_KEY,
                    'units': 'metric',
                    'lang': 'es'
                }

            });

            const resp = await instances.get();
            const {weather, main} = resp.data
            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }


        }catch (e){
            console.log(e)
        }
    }

    agregarHistorial(lugar = ''){

        if(this.historial.includes( lugar.toLocaleLowerCase() )){
            return;
        }
        this.historial = this.historial.splice(0,5);

        this.historial.unshift(lugar.toLocaleLowerCase());

        // Grabar en BD
        this.guardarDB();

    }

    guardarDB(){
        fs.writeFileSync(this.dbPath, JSON.stringify(this.historial))
    }

    leerDB(){
        if( !fs.existsSync(this.dbPath) ){
            return null;
        }

        const histo = fs.readFileSync(this.dbPath,{ encoding: 'utf-8' })
        const data = JSON.parse(histo);

        this.historial = data

    }


};

module.exports = {
    Busquedas
};