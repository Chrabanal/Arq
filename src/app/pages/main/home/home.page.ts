import { User } from './../../../models/user.model';
import { Component, OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Product } from 'src/app/models/product.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/components/add-update-product/add-update-product.component';
import { ScannerQRCodeConfig, NgxScannerQrcodeService } from 'ngx-scanner-qrcode'
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);



  products : Product[] = [];
  loading : boolean = false;

  //====scanner qr code ===
  barcodes: Barcode[] = [];
  isSupported = false;
  isWeb = false;

  config: ScannerQRCodeConfig = {
    isBeep: true
  }
  //Creacion de los constructores de la home page
  constructor(private alertController: AlertController,
    private platform: Platform,
    private ngxScannerService: NgxScannerQrcodeService
  ) { }

  ngOnInit() {
    //Checkear la plataforma
    this.checkPlatform();
    if (!this.isWeb) {
      BarcodeScanner.isSupported().then((result) => {
        this.isSupported = result.supported;
      });
    }
  }

  checkPlatform() {
    if (this.platform.is('android') || this.platform.is('ios')) {
      console.log('Running on android / IOS!');
    } else if (this.platform.is('desktop') || this.platform.is('mobileweb')) {
      console.log('Running on the web!');
      this.isWeb = true;
    }
  }

  scanResult(result:any):void{
    console.log('Resultado:',result);
  }

  async scan(): Promise<void> {
    if (this.isWeb) {
      console.log('Utilizando el ngx-scanner');
    } else {
      const granted = await this.requestPermissions();
      if (!granted) {
        this.presentAlert();
        return;
      }
      const { barcodes } = await BarcodeScanner.scan();
      this.barcodes.push(...barcodes);
    }
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permission denied',
      message: 'Please grant camera permission to use the barcode scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

//=====cerrar sesion =====
  signOut(){
    this.firebaseSvc.signOut();
  }

//====agregar un producto===

async addUpdateProduct(product?: Product){

 let success = await this.utilsSvc.presentModal({
    component: AddUpdateProductComponent,
   cssClass: 'add-update-modal',
   componentProps: {
    product
   }
  })
 if (success) this.getProducts();


}

User(): User {
  return this.utilsSvc.getFromLocalStorage('user') ;
}

ionViewWillEnter(){
 this.getProducts();
}





// ======obtener productos =====

getProducts(){
 let path = `users/${this.User().uid}/products`;
 this.loading = true;

let sub = this.firebaseSvc.getCollectionsData(path).subscribe ({
   next:(res:any) => {
     console.log(res);
     this.products = res;
     this.loading = false;
     sub.unsubscribe();
   }


 })

}

  //==eliminar producto ===
  async deleteProduct(product : Product){ {


    let path = `users/${this.User().uid}/products/${product.id}`;

    const loading = await this.utilsSvc.loading();
    await loading.present();


    let imagePath = await this.firebaseSvc.getFilePath(product.image);
    await this.firebaseSvc.deleteFile(imagePath);

    this.firebaseSvc.deleteDocument(path).then(async (res) => {


      this.products = this.products.filter(p => p.id !== product.id);




      this.utilsSvc.presentToast({
        message: 'Producto Eliminado con éxito',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    }).catch((error) => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar el producto',
        duration: 2500,
        color: 'danger',
        position: 'middle',
        icon: 'alert-circle-outline',
      });
    }).finally(() => {
      loading.dismiss();
    });
  }

}
//====gasto producto ===
getProfits(){
  return this.products.reduce((index, product) => index + product.price*product.soldUnits, 0);
}

}