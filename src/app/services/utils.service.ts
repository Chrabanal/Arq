import { ProfilePageModule } from './../pages/main/profile/profile.module';
import { inject, Injectable, ModelOptions } from '@angular/core';
import { LoadingController, ModalController, ToastOptions } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { ModalOptions } from '@ionic/core';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CameraSource } from '@capacitor/camera';


@Injectable({
  providedIn: 'root',
})
export class UtilsService {

  loadingCtrl = inject(LoadingController);
  toastCtrl = inject(ToastController);
  modalCtr = inject(ModalController);
  router = inject(Router);


//===========CAMERA========
async takePicture(promptLabelHeader: string) { 
    return await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      promptLabelHeader: promptLabelHeader,
      promptLabelPhoto: 'selecciona una imagen',
      promptLabelPicture: 'tomar una foto',

    });
  }






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


  //==modal 

  async presentModal(opts: ModalOptions) {
    const modal = await this.modalCtr.create(opts);
    await modal.present();

    const { data } = await modal.onWillDismiss();
    if (data) return data;
  }

  dismissModal(data?: any) {
    return this.modalCtr.dismiss(data);
  }


}
