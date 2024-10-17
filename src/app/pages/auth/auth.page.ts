import { Component, inject, OnInit } from '@angular/core';
import { FormGroup , FormControl , Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {


  form= new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      
  });

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {}

async submit(){

  const loading = await this.utilsSvc.loading();
  await loading.present();

  this.firebaseSvc.signIn(this.form.value as User).then(res=> {
    

  this.getUserInfo(res.user.uid);

  }).catch(error => {
    console.log(error);


     this.utilsSvc.presentToast({message: "contraseña incorrecta",
       duration: 2500, 
       color: 'danger',
       position:'middle' ,
       icon:'alert-circle-outline'});




  }).finally(() => {
    loading.dismiss();
  });
  
}

async getUserInfo(uid: string) {
  if (this.form.valid) { // Mismo cambio aquí
    const loading = await this.utilsSvc.loading();
    await loading.present();

    let path = `users/${uid}`;


    this.firebaseSvc.getDocument(path).then((user:User )=> {
      this.utilsSvc.saveInLocalStorage('user', user);
      this.utilsSvc.routerLink('/main/home');
      this.form.reset();

      this.utilsSvc.presentToast({
        message: `Bienvenido a CheckMyStock ${user.name}`,
        duration: 1500,
        color: 'primary',
        position: 'middle',
        icon: 'person-circle-outline',
      });





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
