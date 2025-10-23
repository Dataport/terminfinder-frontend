import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Location } from "@angular/common";
import { RouteTitleService } from "../../shared/services/route-title.service";
import { StringTransformService } from 'src/app/shared/services/string-transform.service';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss']
})
export class TermsOfServiceComponent implements OnInit {

  readonly termsOfService: SafeHtml = this.stringTransformService.decodeAndSanitize(environment.termsOfService);

  constructor(private location: Location, private routeTitle: RouteTitleService, private stringTransformService: StringTransformService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('tos.tos');
  }

  back(): void {
    this.location.back();
  }
}
