import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';


//-------firebase------
import{AngularFireModule} from '@angular/fire/compat';
import { environment } from 'src/environments/environment.prod';
//-------NgxScanner------
import { NgxScannerQrcodeModule, LOAD_WASM } from 'ngx-scanner-qrcode';
LOAD_WASM().subscribe();



@NgModule({
  declarations: [AppComponent],

  imports: [BrowserModule, 
    IonicModule.forRoot({mode:'md'}),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    NgxScannerQrcodeModule
  ],

  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy,} ],
  bootstrap: [AppComponent],
})
export class AppModule {}
