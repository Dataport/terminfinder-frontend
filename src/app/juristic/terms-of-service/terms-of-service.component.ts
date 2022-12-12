import {Component} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Location} from "@angular/common";

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss']
})
export class TermsOfServiceComponent {

  termsOfService = environment.termsOfService;

  constructor(private location: Location) {
  }

  back(): void {
    this.location.back();
  }

}
