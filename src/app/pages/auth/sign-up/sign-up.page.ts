import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User} from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
    ]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

  async submit() {
    if (this.form.valid) {  // Aquí verificamos si el formulario es válido
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      this.firebaseSvc
        .signUp(this.form.value as User)
        .then(async (res) => {
          await this.firebaseSvc.updateUser(this.form.value.name);
  
          let uid = res.user.uid;
          this.form.controls.uid.setValue(uid);
          this.setUserInfo(uid);
        })
        .catch((error) => {
          console.log(error);
          this.utilsSvc.presentToast({
            message: 'contraseña incorrecta',
            duration: 2500,
            color: 'danger',
            position: 'middle',
            icon: 'alert-circle-outline',
          });
        })
        .finally(() => {
          loading.dismiss();
        });
    } else {
      // Notificar al usuario que el formulario es inválido
      this.utilsSvc.presentToast({
        message: 'Formulario inválido. Verifique los campos.',
        duration: 2500,
        color: 'warning',
        position: 'top',
        icon: 'alert-circle-outline',
      });
    }
  }
  
  async setUserInfo(uid: string) {
    if (this.form.valid) { // Mismo cambio aquí
      const loading = await this.utilsSvc.loading();
      await loading.present();
  
      let path = `users/${uid}`;
      delete this.form.value.password;
  
      this.firebaseSvc.setDocument(path, this.form.value).then(async res => {
        this.utilsSvc.saveInLocalStorage('user', this.form.value);
        this.utilsSvc.routerLink('/main/home');
        this.form.reset();
      })
      .catch((error) => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Error al guardar la información del usuario',
          duration: 2500,
          color: 'danger',
          position: 'middle',
          icon: 'alert-circle-outline',
        });
      })
      .finally(() => {
        loading.dismiss();
      });
    } else {
      this.utilsSvc.presentToast({
        message: 'Formulario inválido. Verifique los campos.',
        duration: 2500,
        color: 'warning',
        position: 'top',
        icon: 'alert-circle-outline',
      });
    }
  }
}  