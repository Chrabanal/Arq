import { UtilsService } from 'src/app/services/utils.service';
import { Component, inject, Input,  OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;
  @Input() backButton! : String;
  @Input() isModal! : boolean;

  UtilsSvc = inject(UtilsService);

  ngOnInit() {}

  dismissModal() {
    this.UtilsSvc.dismissModal();
  }


}
