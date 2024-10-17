import { inject, Injectable } from '@angular/core';
import { LoadingController, ToastOptions } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  router = inject(Router);

  //===========loading========
  loading() {
    return this.loadingCtrl.create({ spinner:'crescent'});
  }

  async presentToast(opts?: ToastOptions) {
    const toast = await this.toastCtrl.create(opts);
    toast.present();
  }

  //===========routerLink========
  routerLink(url: string) {
    return this.router.navigateByUrl(url);
  }

  //===========CREA UN ELEMENTO EN localstorage========

  saveInLocalStorage(key: string, value: any) {
    return localStorage.setItem(key, JSON.stringify(value));
  }

  //=======OBTIENE UN ELEMENTO DE localstorage========

  getFromLocalStorage(key: string) {
    return JSON.parse(localStorage.getItem(key));
  }

  
}
