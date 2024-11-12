import { Component, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { inject } from '@angular/core';

@Component({
  selector: 'app-gastos',
  templateUrl: './gastos.page.html',
  styleUrls: ['./gastos.page.scss'],
})
export class GastosPage implements OnInit {
  products: Product[] = []; // Lista de productos cargados
  filteredProducts: Product[] = []; // Lista de productos filtrados por mes
  loading: boolean = false;
  currentMonth: string;
  selectedMonth: string;
  months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  // Inyectar servicios
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    this.setCurrentMonth();
    this.loadGastos();
  }

  // Establecer el mes actual y el mes seleccionado por defecto
  setCurrentMonth() {
    const date = new Date();
    this.currentMonth = this.months[date.getMonth()];
    this.selectedMonth = this.currentMonth;
  }

  // Cargar productos desde Firebase y filtrar por mes
  loadGastos() {
    const path = `users/${this.User().uid}/products`; // Ruta a la colección de productos del usuario
    this.loading = true;

    const sub = this.firebaseSvc.getCollectionsData(path).subscribe({
      next: (res: any) => {
        this.products = res;
        this.filterProductsByMonth();
        this.loading = false;
        sub.unsubscribe();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  // Filtrar productos por el mes seleccionado
  filterProductsByMonth() {
    this.filteredProducts = this.products.filter(product => product.month === this.selectedMonth);
  }

  // Obtener el total de gastos para el mes seleccionado
  getProfits() {
    return this.filteredProducts.reduce((total, product) => total + product.price * product.soldUnits, 0);
  }

  // Obtener el usuario de LocalStorage
  User() {
    return this.utilsSvc.getFromLocalStorage('user');
  }
}
