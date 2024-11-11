import { Component,  Input,OnInit,inject } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { User } from 'src/app/models/user.model';







@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  User(): User {
    return this.utilsSvc.getFromLocalStorage('user') ;
  }


  async takeImage() {

    let user = this.User();
    let path = `users/${user.uid}`; 

  

    const dataUrl = (await this.utilsSvc.takePicture('imagen del Perfil')).dataUrl;
    
    const loading = await this.utilsSvc.loading();
    await loading.present();

    let imagePath = `${user.image}/profile`;
    user.image = await this.firebaseSvc.uploadImage(imagePath, dataUrl);


    this.firebaseSvc.updateDocument(path, {image: user.image}).then(async (res) => {

      this.utilsSvc.saveInLocalStorage('user', user);

      this.utilsSvc.presentToast({
        message: 'Imagen actualizada con éxito',
        duration: 1500,
        color: 'success',
        position: 'middle',
        icon: 'checkmark-circle-outline',
      });
    }).catch((error) => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Error al actualizar la Imagen',
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

