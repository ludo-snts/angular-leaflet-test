import { Component, AfterViewInit, NgZone } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-search';


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
  // Initialisation à false pour cacher search-input-container
  public showSearch = false;


  // Initialisation des tuiles
  private defaultTiles!: L.TileLayer; // tuiles par défaut (tuiles openStreetMap en ligne)
  private satelliteTiles!: L.TileLayer; // tuiles satellite (tuiles openStreetMap en ligne)
  private OSM01Tiles!: L.TileLayer; // tuiles (version de base) tuiles stockées en local dans le dossier assets/tiles/openStreetMap01
  private OSM02Tiles!: L.TileLayer; // tuiles (version humanitaire) tuiles stockées en local dans le dossier assets/tiles/openStreetMap02
  private USGSSatelliteTiles!: L.TileLayer; // tuiles (version satellite) tuiles stockées en local dans le dossier assets/tiles/USGSNationalMapSatellite

  // Initialisation de la variable de zoom
  public currentZoomLevel: number = 7; // Initialisez-la avec la valeur de zoom par défaut

  // initialisation de la carte (valeur par défaut)
  private initMap(): void {
    this.map = L.map('map', {
      center: [42.69607784382969, 2.8892290890216943], // coordonnées GPS lattitude, longitude de Mind And Go
      zoom: 7, // zoom de la carte
      zoomControl: false, // désactivation du zoom par défaut
    });

    // initialisation des tuiles par défaut (tuiles openStreetMap en ligne)
    this.defaultTiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 1,
    });

    // initialisation des tuiles par défaut (tuiles openStreetMap en ligne)
    this.satelliteTiles = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      minZoom: 1,
    });

    // initialisation des tuiles (version de base) tuiles stockées en local dans le dossier assets/tiles/openStreetMap01
    this.OSM01Tiles = L.tileLayer('assets/tiles/openStreetMap01/{z}/{x}/{y}.png', {
      maxZoom: 7,
      minZoom: 1,
    });

    // initialisation des tuiles (version humanitaire) tuiles stockées en local dans le dossier assets/tiles/openStreetMap02
    this.OSM02Tiles = L.tileLayer('assets/tiles/openStreetMap02/{z}/{x}/{y}.png', {
      maxZoom: 7,
      minZoom: 1,
    });

    // initialisation des tuiles (version satellite) tuiles stockées en local dans le dossier assets/tiles/USGSNationalMapSatellite
    this.USGSSatelliteTiles = L.tileLayer('assets/tiles/USGSNationalMapSatellite/{z}/{x}/{y}.jpg', {
      maxZoom: 7,
      minZoom: 1,
    });



    // ajout des tuiles à la carte
    // customTiles.addTo(this.map);
    this.defaultTiles.addTo(this.map);


    // ajout du controle des couches (tuiles)
    const baseMaps= {
      " ":this.defaultTiles,
      "  ":this.satelliteTiles,
      "   ":this.OSM01Tiles,
      "    ":this.OSM02Tiles,
      "     ":this.USGSSatelliteTiles
    };

    // ajout du controle des couches (tuiles) bis
    let overlayMaps = { 
    };

    // TODO comprendre pourquoi sans overlayMaps, le controle des couches ne s'affiche pas
    L.control.layers(baseMaps, overlayMaps, {
      position: 'bottomleft' // Spécifier la position en bas à gauche
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

    // TEST: ajout d'un marqueur personnalisé sur la carte : OK
    const icon = L.divIcon({
      html: "<div class='custom-pin'><img src='./assets/icons/map-pin-solid.svg'></img></div>",
      // iconSize: [30, 30],
      iconAnchor: [ 15, 30 ]
    });
    // const marker = L.marker([42.69607784382969, 2.8892290890216943], { icon }); // définir la position du marqueur
    // marker.bindPopup('<b>Hello !</b>'); // ajouter un popup au marqueur
    // marker.addTo(this.map); // ajouter le marqueur à la carte

    // TEST: afficher le niveau de zoom : OK
    this.map.on('zoomend', () => {
      // Mise à jour de la valeur du niveau de zoom actuel lorsque le zoom change
      this.currentZoomLevel = this.map.getZoom();
    }
    );

    // TEST: ajout d'un layerGroup pour la recherche) : OK
    // var testLayer = L.layerGroup();

    // TEST: créer markers a partir du fichier data.json et boucler sur les données pour créer les markers : OK OBSOLETE (remplacé par geoJSON)
    //structure d'un element du json: {"nom": "Tokyo","latitude": 35.682839,"longitude": 139.759455}
    // les ajouter au layerGroup testLayer
    // fetch('./assets/data/data.json').then(res => res.json()).then(data => {
    //   data.forEach((element: { nom: string; latitude: number; longitude: number; }) => {
    //     const marker = L.marker([element.latitude, element.longitude], { icon });
    //     marker.bindPopup(element.nom);
    //     marker.addTo(testLayer);
    //   });
    // }
    // );
    //TEST: faire apparaitre le layerGroup testLayer avec l'input checkbox id="settings-markers" : OK OBSOLETE (remplacé par geoJSON)
    // const settingsMarkers = document.getElementById('settings-markers');
    // settingsMarkers?.addEventListener('change', (event) => {
    //   if (event.target instanceof HTMLInputElement) {
    //     if (event.target.checked) {
    //       testLayer.addTo(this.map);
    //     } else {
    //       testLayer.remove();
    //     }
    //   }
    // });

    //TEST: La même chose avec un fichier geoJSON
    //structure d'un element du geoJSON: {"properties": {"country": "Bangladesh","city": "Dhaka","tld": "bd","iso3": "BGD","iso2": "BD"},"geometry": {"coordinates": [90.24, 23.43], "type": "Point"},"id": "BD"}
    // les ajouter au layerGroup geoJSONLayer : OK
    var geoJSONLayer = L.layerGroup();
    fetch('./assets/data/capitals.geojson')
      .then(res => res.json())
      .then(data => {
        data.features.forEach((element: { properties: { city: string; }; geometry: { coordinates: number[]; }; }) => {
          const marker = L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]], { icon });
          marker.bindPopup(element.properties.city);
          marker.addTo(geoJSONLayer);
      });
    }
    );

    //TEST: faire apparaitre le layerGroup geoJSONLayer avec l'input checkbox id="settings-markers" : OK
    const settingsMarkers = document.getElementById('settings-markers');
    settingsMarkers?.addEventListener('change', (event) => {
      if (event.target instanceof HTMLInputElement) {
        if (event.target.checked) {
          geoJSONLayer.addTo(this.map);
        } else {
          geoJSONLayer.remove();
        }
      }
    }
    );

    //TEST: ajout d'un layerGroup pour les frontières (geoJSON) : OK
    var frontiersLayer = L.geoJSON();
    fetch('assets/data/world.geojson')
    .then(response => response.json())
    .then(data => {
      // Ajoutez chaque entité GeoJSON à la couche
      L.geoJSON(data, {
        style: {
          color: "white", // Couleur des lignes à blanc
          weight: 1,      // Épaisseur des lignes en pixels
          opacity: 1,     // Opacité des lignes (0 à 1)
          fillOpacity: 0.1 // Opacité de remplissage des polygones (0 à 1)
        },
        // onEachFeature: function (feature, layer) {
        //   // Créez une popup avec le nom du département pour chaque entité
        //   layer.bindPopup(feature.properties.nom);
        // }
      }).addTo(frontiersLayer);
    });

    //TEST: faire apparaitre le layerGroup frontiersLayer avec l'input checkbox id="settings-frontiers" : OK
    const settingsFrontiers = document.getElementById('settings-frontiers');
    settingsFrontiers?.addEventListener('change', (event) => {
      if (event.target instanceof HTMLInputElement) {
        if (event.target.checked) {
          frontiersLayer.addTo(this.map);
        } else {
          frontiersLayer.remove();
        }
      }
    }
    );

    //TEST: ajout d'un layerGroup pour les lacs (geoJSON) : OK
    var lakesLayer = L.geoJSON();
    fetch('https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_lakes.geojson')
    .then(response => response.json())
    .then(data => {
      // Ajoutez chaque entité GeoJSON à la couche
      L.geoJSON(data, {
        style: {
          color: "blue", // Couleur des lignes à blanc
          weight: 1,      // Épaisseur des lignes en pixels
          opacity: 1,     // Opacité des lignes (0 à 1)
          fillOpacity: 0.3 // Opacité de remplissage des polygones (0 à 1)
        },
        // onEachFeature: function (feature, layer) {
        //   // Créez une popup avec le nom du département pour chaque entité
        //   layer.bindPopup(feature.properties.nom);
        // }
      }).addTo(lakesLayer);
    });

    //TEST: faire apparaitre le layerGroup lakesLayer avec l'input checkbox id="settings-lakes" : OK
    const settingsLakes = document.getElementById('settings-lakes');
    settingsLakes?.addEventListener('change', (event) => {
      if (event.target instanceof HTMLInputElement) {
        if (event.target.checked) {
          lakesLayer.addTo(this.map);
        } else {
          lakesLayer.remove();
        }
      }
    }
    );

    //TEST: ajout d'une fonction de recherche leaflet-search : KO
    // var searchLayer = L.layerGroup().addTo(this.map);
    // //... adding data in searchLayer ...
    // this.map.addControl( new L.Control.Search({layer: searchLayer}) );
    // //searchLayer is a L.LayerGroup contains searched markers

    


  } // fin de la fonction initMap()



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

    this.map.locate({ setView: true, maxZoom: 7 });

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

  // fonction accompagnant l'apparition/disparition du menu réglages:
  toggleSettings(): void {
    // Inverser la valeur actuelle de showSettings
    this.showSettings = !this.showSettings;
  }

  // fonction accompagnant l'apparition/disparition de l'input de recherche:
  toggleSearch(): void {
    // Inverser la valeur actuelle de showSearch
    this.showSearch = !this.showSearch;
  }

  //TEST: Fonction de recherche dans les fichier geoJSON via le champs de saisie de l'input id="search-input" : EN COURS
  search(): void {
    // Récupérer la valeur de l'input
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const searchValue = searchInput.value;

    // Si la valeur de l'input est vide, ne rien faire
    if (searchValue === '') {
      return;
    }

    // Si la valeur de l'input n'est pas vide, rechercher dans le fichier geoJSON
    fetch('./assets/data/capitals.geojson')
      .then(res => res.json())
      .then(data => {
        // Créer un tableau vide pour stocker les résultats de la recherche
        const searchResults: any[] = []; 
        console.log(searchValue) //OK 

        
        // Boucler sur les données du fichier geoJSON
        data.features.forEach((element: { properties?: { city?: string }; geometry: { coordinates: number[] } }) => {
          // Check if element.properties and element.properties.city exist
          if (element.properties?.city?.toLowerCase().includes(searchValue.toLowerCase())) {
            searchResults.push(element);
            console.table(element); //OK
          }
        });

        // Si le tableau des résultats est vide, afficher un message d'erreur
        if (searchResults.length === 0) {
          alert('Aucun résultat trouvé');
          return;
        }

        //TODO On en est là
        // Si le tableau des résultats n'est pas vide, afficher les résultats sur la carte
        // Créer un layerGroup pour stocker les résultats de la recherche
        const searchResultsLayer = L.layerGroup();
        
        // Boucler sur les résultats de la recherche
        searchResults.forEach((element: { properties: { city: string; }; geometry: { coordinates: number[]; }; }) => {
          // Créer un marqueur pour chaque résultat
          const marker = L.marker([element.geometry.coordinates[1], element.geometry.coordinates[0]]);
          // Ajouter le marqueur au layerGroup
          marker.addTo(searchResultsLayer);
        });
        
        // Ajouter le layerGroup à la carte
        searchResultsLayer.addTo(this.map);
      });
  }

  




  

  constructor() {

  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  

}
