import {Component} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Location} from "@angular/common";

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent {

  privacy = environment.privacy;

  constructor(private location: Location) {
  }

  back(): void {
    this.location.back();
  }

}
