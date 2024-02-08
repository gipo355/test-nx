/* eslint-disable node/no-extraneous-import */
/* eslint-disable import/no-extraneous-dependencies */
import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl'; // we won't install in the project package.json because we want it bundled ( node externals prevent bundling all installed packages)

import { MAPBOX_PUBLIC_KEY } from './environment.ts';

const mapboxModule = function mapboxModule() {
  // import {x} from './moduleTest.js'
  // console.log("Hello from the client side")
  // console.log(x)
  const EL_MAP = document.querySelector('#map');

  if (!EL_MAP) return;

  const createMap = () => {
    const tourLocations = JSON.parse(
      document.querySelector('#map').dataset.tourLocations
    );
    // const [{ coordinates: startCoordinates }] = tourLocations;
    // console.log(startCoordinates)
    // const [startLng, startLat] = startCoordinates;
    // console.log(tourLocations)
    // let lat = 38;
    // let lng = -99;
    // const userLocation = navigator.geolocation.getCurrentPosition((position) => {
    //   lat = position.coords.latitude ?? lat;
    //   lng = position.coords.longitude ?? lng;
    // });
    // console.log(userLocation)
    // mapboxgl.accessToken = process.env.MAPBOX_PUBLIC_KEY;
    mapboxgl.accessToken = MAPBOX_PUBLIC_KEY;
    const map = new mapboxgl.Map({
      container: 'map', // container ID
      // we replace the style below with the custom we created
      // style: 'mapbox://styles/mapbox/streets-v12', // style URL
      style: 'mapbox://styles/gipo18649/cliq016rt00qr01pf7bxc34mc',
      // center: [-74.5, 40], // starting position [lng, lat]
      // center: [lng,lat], // starting position [lng, lat]
      // center: [startLng,startLat], // starting position [lng, lat]

      /*
       * prevent scrolling to zoom in and out, bad ux
       */
      // interactive: false, // doesn't allow panning the map
      scrollZoom: false, // locks only zooming

      zoom: 6, // starting zoom
    });

    const bounds = new mapboxgl.LngLatBounds();

    // custom markers to add to mapbox designed by jonas
    // eslint-disable-next-line no-restricted-syntax
    for (const location of tourLocations) {
      /*
       * create marker
       */
      const element = document.createElement('div');
      element.className = 'marker';
      new mapboxgl.Marker({
        element,
        anchor: 'bottom',
      })
        .setLngLat(location.coordinates)
        .addTo(map);
      /*
       * create popup
       */
      new mapboxgl.Popup({
        offset: 20,
      })
        .setLngLat(location.coordinates)
        /*
         * possible security issue with innerHTML, inserts location.description into the DOM which is user input
         */
        .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
        .addTo(map);
      // console.log(location);

      // Extend map bounds to include current location.
      bounds.extend(location.coordinates);
    }

    /*
     * center map bound to include all locations
     * use padding to make sure all locations are visible
     * moves the map to fit the bounds
     */
    map.fitBounds(bounds, {
      padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100,
      },
    });

    // Set marker options.
    // tourLocations.forEach(({coordinates}) => {
    //   // console.log(coordinates)
    //   const [lng, lat] = coordinates
    //   new mapboxgl.Marker({
    //   color: "#FF0000",
    //   draggable: false
    //   }).setLngLat([lng, lat])
    //   .addTo(map);
    // })
  };
  createMap();
};

export { mapboxModule };
