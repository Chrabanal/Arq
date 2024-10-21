import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  opcionesMapa: google.maps.MapOptions = {
    mapId: "5045b0938bdc2d71",
    center: { lat: -33.056901527963824, lng: -71.62605794589133 },
    zoom: 12,
  };

  datosUbicacion: { lat: number, lng: number } | null = null;
  marcador: google.maps.Marker | null = null;
  mapa: google.maps.Map | null = null;
  mensajeError: string | null = null;
  consultaBusqueda: string = '';
  servicio: google.maps.places.PlacesService | null = null;
  servicioDirecciones: google.maps.DirectionsService | null = null;
  renderizadorDirecciones: google.maps.DirectionsRenderer | null = null;
  autocompletado: google.maps.places.Autocomplete | null = null;

  supermercados: string[] = [
    'Acuenta', 'Ekono', 'Lider', 'Santa Isabel', 'Tottus', 'OXXO'
  ];

  constructor() {}

  ngOnInit() {
    this.obtenerUbicacionActual();
  }

  alMapaListo(mapa: google.maps.Map) {
    this.mapa = mapa;
    const input = document.getElementById('autocompletar') as HTMLInputElement;
    this.autocompletado = new google.maps.places.Autocomplete(input);
    this.autocompletado.setFields(["place_id", "geometry", "name"]);

    const suroeste = { lat: -56.0, lng: -75.0 };
    const noreste = { lat: -17.0, lng: -66.0 };
    const limites = new google.maps.LatLngBounds(suroeste, noreste);
    this.autocompletado.setBounds(limites);
    this.autocompletado.bindTo("bounds", this.mapa);
    this.autocompletado.setComponentRestrictions({ country: ["cl"] });
    this.autocompletado.setOptions({ strictBounds: true });

    this.autocompletado.addListener('place_changed', () => {
      const lugar = this.autocompletado?.getPlace();
      if (!lugar?.geometry || !lugar.geometry.location) {
        this.mostrarError('No se encontró información del lugar.');
        return;
      }

      const supermercadoCoincide = this.supermercados.find(s => lugar.name.includes(s));
      if (supermercadoCoincide) {
        this.datosUbicacion = {
          lat: lugar.geometry.location.lat(),
          lng: lugar.geometry.location.lng(),
        };
        this.actualizarMapa(this.datosUbicacion.lat, this.datosUbicacion.lng);
      } else {
        this.mostrarError('Por favor selecciona un supermercado de la lista.');
      }
    });

    if (this.datosUbicacion) {
      this.actualizarMapa(this.datosUbicacion.lat, this.datosUbicacion.lng);
    }

    this.servicio = new google.maps.places.PlacesService(this.mapa);
    this.servicioDirecciones = new google.maps.DirectionsService();
    this.renderizadorDirecciones = new google.maps.DirectionsRenderer();
    this.renderizadorDirecciones.setMap(this.mapa);
  }

  alHacerClicMapa(evento: google.maps.MapMouseEvent) {
    if (evento.latLng) {
      this.actualizarMapa(evento.latLng.lat(), evento.latLng.lng());
    }
  }

  obtenerUbicacionActual() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          this.datosUbicacion = {
            lat: posicion.coords.latitude,
            lng: posicion.coords.longitude,
          };
          this.actualizarMapa(this.datosUbicacion.lat, this.datosUbicacion.lng);
        },
        (error) => {
          this.mostrarError('Error obteniendo la ubicación.');
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      this.mostrarError('Geolocalización no es compatible con este navegador.');
    }
  }

  buscarLugares() {
    if (!this.servicio || !this.mapa) {
      this.mostrarError('Servicio no disponible.');
      return;
    }

    if (this.consultaBusqueda) {
      const peticion = {
        query: this.consultaBusqueda,
        fields: ['name', 'geometry'],
      };
      this.servicio.textSearch(peticion, (resultados, estado) => {
        if (estado === google.maps.places.PlacesServiceStatus.OK && resultados) {
          const lugar = resultados[0];
          if (lugar.geometry && lugar.geometry.location) {
            this.actualizarMapa(lugar.geometry.location.lat(), lugar.geometry.location.lng());
          } else {
            this.mostrarError('No se encontraron resultados.');
          }
        } else {
          this.mostrarError('No se encontraron resultados.');
        }
      });
    } else {
      this.mostrarError('Ingresa una consulta de búsqueda válida.');
    }
  }

  obtenerDirecciones() {
    if (this.servicioDirecciones && this.datosUbicacion && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          const origen = new google.maps.LatLng(posicion.coords.latitude, posicion.coords.longitude);
          const destino = new google.maps.LatLng(this.datosUbicacion!.lat, this.datosUbicacion!.lng);

          const peticion: google.maps.DirectionsRequest = {
            origin: origen,
            destination: destino,
            travelMode: google.maps.TravelMode.DRIVING,
          };

          this.servicioDirecciones?.route(peticion, (resultado, estado) => {
            if (estado === google.maps.DirectionsStatus.OK) {
              this.renderizadorDirecciones?.setDirections(resultado);
            } else {
              this.mostrarError('Error obteniendo direcciones.');
            }
          });
        },
        (error) => {
          this.mostrarError('No se pudo obtener tu ubicación para generar la ruta.');
        }
      );
    }
  }

  actualizarMapa(lat: number, lng: number) {
    this.centrarMapa(lat, lng);
    this.agregarMarcador(lat, lng);
  }

  centrarMapa(lat: number, lng: number) {
    this.mapa?.setCenter({ lat, lng });
    this.mapa?.setZoom(15);
  }

  agregarMarcador(lat: number, lng: number) {
    if (this.marcador) {
      // Mover el marcador existente
      this.marcador.setPosition({ lat, lng });
    } else {
      // Crear un nuevo marcador si no existe
      this.marcador = new google.maps.Marker({
        position: { lat, lng },
        map: this.mapa,
        title: "Ubicación encontrada",
      });
    }
  }

  irALaUbicacionActual() {
    if (this.datosUbicacion) {
      this.actualizarMapa(this.datosUbicacion.lat, this.datosUbicacion.lng);
    } else {
      this.obtenerUbicacionActual();
    }
  }

  mostrarError(mensaje: string) {
    this.mensajeError = mensaje;
    console.error(mensaje);
  }
}
