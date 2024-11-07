import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";
import {Location} from "@angular/common";
import {RouteTitleService} from "../../shared/services/route-title.service";

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  privacy = environment.privacy;

  constructor(private location: Location, private routeTitle: RouteTitleService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('privacy.declaration');
  }

  back(): void {
    this.location.back();
  }
}
