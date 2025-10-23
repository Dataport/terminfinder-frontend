import { Component, OnInit } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Location } from "@angular/common";
import { RouteTitleService } from "../../shared/services/route-title.service";
import { SafeHtml } from '@angular/platform-browser';
import { StringTransformService } from 'src/app/shared/services/string-transform.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  readonly privacy: SafeHtml = this.stringTransformService.decodeAndSanitize(environment.privacy);

  constructor(private location: Location, private routeTitle: RouteTitleService, private stringTransformService: StringTransformService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('privacy.declaration');
  }

  back(): void {
    this.location.back();
  }
}
