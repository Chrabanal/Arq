import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgxScannerQrcodeModule } from 'ngx-scanner-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    SharedModule,
    NgxScannerQrcodeModule
    
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
