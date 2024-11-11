import { Component, inject, OnInit } from '@angular/core';
import { FormGroup , FormControl , Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';



@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  form= new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
});

firebaseSvc = inject(FirebaseService);
utilsSvc = inject(UtilsService);

ngOnInit() {}

async submit(){

const loading = await this.utilsSvc.loading();
await loading.present();

this.firebaseSvc.sendRecoveryEmail(this.form.value.email).then(res=> {
  


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



}