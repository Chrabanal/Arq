import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  options: google.maps.MapOptions = {
    mapId: "5045b0938bdc2d71",
    center: { lat: -33.056901527963824, lng: -71.62605794589133 },
    zoom: 4,
  };
  locationData: { lat: number, lng: number } | null = null;  

  constructor() {}

  ngOnInit() {}

  onMapClick(event: google.maps.MapMouseEvent) {
    console.log('Map click event:', event);
    if (event.latLng) {
      this.locationData = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng()
      };
    }
  }
}