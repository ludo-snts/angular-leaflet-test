import { Component, AfterViewInit, NgZone } from '@angular/core';
import * as L from 'leaflet';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  // private map: any;
  private map!: L.Map; // Utilisation du non-null assertion operator (https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator) si probleme avec 'private map;'

  // variable pour suivre l'état de la géolocalisation
  private isGeolocationBlocked = false;

  // Initialisation à false pour cacher settings-wrapper
  public showSettings = false;


  // initialisation de la carte (valeur par défaut)
  private initMap(): void {
    this.map = L.map('map', {
      center: [42.69607784382969, 2.8892290890216943], // coordonnées GPS lattitude, longitude de Mind And Go
      zoom: 15, // zoom de la carte
      zoomControl: false, // désactivation du zoom par défaut
    });

    // initialisation des tuiles (valeur par défaut)
    const customTiles = L.tileLayer('assets/tiles/map_test/{z}/{x}/{y}.png', {
      maxZoom: 15,
      minZoom: 14,
    });

    // TEST: initialisation des tuiles personnalisées (stockées en local dans le dossier assets/tiles/map_test)
    const defaultTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
    });

    // ajout des tuiles à la carte
    customTiles.addTo(this.map);
    defaultTiles.addTo(this.map);

    // ajout du controle des couches (tuiles)
    const baseMaps= {
      "Local":customTiles,
      "En ligne":defaultTiles
    };

    // ajout du controle des couches (tuiles) bis
    let overlayMaps = {
      "Local":customTiles,
      "En ligne":defaultTiles    };

    L.control.layers(baseMaps, overlayMaps, {
      position: 'bottomleft' // Spécifiez la position en bas à gauche
    }).addTo(this.map);


    // ajout du zoom personnalisé
    L.control.zoom({
      position: 'bottomright' // position du zoom personnalisé (en bas à droite), le zoom par défaut est en haut à gauche et il est désactivé
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
    // this.map.locate({ setView: true, maxZoom: 16 });

    // this.map.on('locationfound', (e: L.LocationEvent) => {
    //   const userMarker = L.marker(e.latlng); // Création d'un marqueur à la position de l'utilisateur
    //   userMarker.addTo(this.map);
    // });

    // TEST: ajout d'un marqueur personnalisé
    const icon = L.divIcon({
      // iconUrl: 'https://mind-and-go.com/web/image/website/1/logo?unique=f12e26c',
      // iconUrl: 'https://mind-and-go.com/favicon.ico',
      html: "<div class='custom-pin'><img src='./assets/icons/ludo.png'></img></div>",
      // iconSize: [40, 40],
      // iconAnchor: [ 13, 41 ]
    });
    const marker = L.marker([42.69607784382969, 2.8892290890216943], { icon }); // définir la position du marqueur
    marker.bindPopup('<b>Hello !</b>'); // ajouter un popup au marqueur
    marker.addTo(this.map); // ajouter le marqueur à la carte


  }


  //fonction accompagnasnt le bouton de geolocalisation de l'utilisateur: 
  //(<button class="locate-user-btn" (click)="locateUser()">Localiser Moi</button> dans le html)
  locateUser(): void {
    if (this.isGeolocationBlocked) {
      // Si la géolocalisation a été bloquée précédemment, réessayez la demande
      this.isGeolocationBlocked = false;
    }

    // Ajouter un marqueur à la position de l'utilisateur
    this.map.on('locationfound', (e: L.LocationEvent) => {
      // Création d'un marqueur à la position de l'utilisateur
      const geolocIcon = L.divIcon({
        html: "<div class='geoloc-pin'></div>",
      });
      const userMarker = L.marker(e.latlng, { icon: geolocIcon });
      userMarker.addTo(this.map);
    });

    this.map.locate({ setView: true, maxZoom: 16 });

    // Gérer l'événement de localisation
    this.map.on('locationfound', (e: L.LocationEvent) => {
      // Vous pouvez ajouter du code pour traiter la localisation ici si nécessaire
    });

    // Gérer l'événement de blocage de la géolocalisation
    this.map.on('locationerror', (e: L.ErrorEvent) => {
      if (e.code === 1) {
        // Le navigateur a bloqué la géolocalisation, marquez l'état comme bloqué
        this.isGeolocationBlocked = true;
        // Vous pouvez afficher un message d'erreur à l'utilisateur ici si nécessaire
        // message d'erreur par défaut
        alert('La géolocalisation a été bloquée dans votre navigateur. Veuillez autoriser l\'accès à votre position pour utiliser cette fonctionnalité.');
      }
    });



  }

  // fonction accompagnant l'apparition/disparition du menu réglages':
  toggleSettings(): void {
    // Inverser la valeur actuelle de showSettings
    this.showSettings = !this.showSettings;
  }

  constructor() {

  }

  ngAfterViewInit(): void {
    this.initMap();
  }

}
