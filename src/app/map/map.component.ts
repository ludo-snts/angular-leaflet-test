import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  // private map: any;
  private map!: L.Map; // Utilisation du non-null assertion operator (https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator) si probleme avec 'private map;'

  // initialisation de la carte (valeur par défaut)
  private initMap(): void {
    this.map = L.map('map', {
      center: [42.69607784382969, 2.8892290890216943], // coordonnées GPS lattitude, longitude de Mind And Go
      zoom: 15, // zoom de la carte
      zoomControl: false // désactivation du zoom par défaut
    });

    // initialisation des tuiles (valeur par défaut)
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    // ajout des tuiles à la carte
    tiles.addTo(this.map);

    // ajout du zoom personnalisé
    L.control.zoom({
      position: 'bottomright' // position du zoom personnalisé (en bas à droite)
  }).addTo(this.map);

    // TEST: ajout d'un marqueur sur la carte (position par défaut) : OK
    // const marker = L.marker([ 42.69607784382969, 2.8892290890216943 ]);
    // marker.addTo(this.map);

    // TEST: ajout d'un popup sur le marqueur : OK
      // marker.bindPopup('<b>Hello !</b>');

    // TEST: ajout d'un cercle sur la carte (position par défaut) : OK
    // const circle = L.circle([ 42.69607784382969, 2.8892290890216943 ], {
    //   color: 'red',
    //   fillColor: '#f03',
    //   fillOpacity: 0.5,
    //   radius: 300
    // });
    // circle.addTo(this.map);

    // TEST: ajout d'un marker sur la carte sur la position de l'utilisateur (géolocalisation) : OK
    // ajout de la localisation de l'utilisateur au chargement de la page (si l'utilisateur accepte la géolocalisation) sinon se positionne sur les coordonnées par défaut : OK
    this.map.locate({ setView: true, maxZoom: 16 });

    this.map.on('locationfound', (e: L.LocationEvent) => {
      const userMarker = L.marker(e.latlng); // Création d'un marqueur à la position de l'utilisateur
      userMarker.addTo(this.map);
    });

    // TEST: ajout d'un marqueur personnalisé
    const icon = L.divIcon({
      // iconUrl: 'https://mind-and-go.com/web/image/website/1/logo?unique=f12e26c',
      // iconUrl: 'https://mind-and-go.com/favicon.ico',
      html: "<div class='custom-pin'><img src='./assets/icons/ludo.png'></img></div>",
      // iconSize: [40, 40],
      // iconAnchor: [ 13, 41 ]
    });

    const marker = L.marker([42.69607784382969, 2.8892290890216943], { icon });
    marker.bindPopup('<b>Hello !</b>');

    marker.addTo(this.map);

    // TEST: ajout d'une searchbar
    // var searchbox = L.Control.searchbox({
    //   position: 'topright',
    //   expand: 'left'
    // });
    // searchbox.addTo(this.map);

    

  }


  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

}
