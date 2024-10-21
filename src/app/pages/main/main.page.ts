import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { inject } from '@angular/core';


@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  utilsSvc = inject(UtilsService);

  constructor() { }

  ngOnInit() {
  }


  User(): User {
    return this.utilsSvc.getFromLocalStorage('user') ;
  }


}
