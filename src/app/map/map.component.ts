import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit {

  // private map;
  private map!: L.Map; // Utilisation du non-null assertion operator (https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator) si probleme avec 'private map;'

  // initialisation de la carte (valeur par défaut)
  private initMap(): void {
    this.map = L.map('map', {
        center: [ 42.695648193359375, 2.889158010482788 ], // coordonnées GPS lattitude, longitude de Mind And Go
        zoom: 15 // zoom de la carte
    });
    
    // initialisation des tuiles (valeur par défaut)
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    

    tiles.addTo(this.map);
  }
  

  constructor() { }

  ngAfterViewInit(): void {
    this.initMap();
  }

}
