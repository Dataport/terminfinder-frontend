import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Location} from "@angular/common";
import {RouteTitleService} from "../../shared/services/route-title.service";

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss']
})
export class TermsOfServiceComponent implements OnInit {

  termsOfService = environment.termsOfService;

  constructor(private location: Location, private routeTitle: RouteTitleService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('tos.tos');
  }

  back(): void {
    this.location.back();
  }
}
