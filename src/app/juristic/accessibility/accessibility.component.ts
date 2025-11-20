import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { RouteTitleService } from "../../shared/services/route-title.service";
import { SafeHtml } from '@angular/platform-browser';
import { StringTransformService } from 'src/app/shared/services/string-transform.service';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss'],
  standalone: false
})
export class AccessibilityComponent implements OnInit {
  readonly title = environment.title;
  readonly accessibility: SafeHtml = this.stringTransformService.decodeAndSanitize(environment.accessibility);

  constructor(private location: Location, private routeTitle: RouteTitleService, private stringTransformService: StringTransformService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('footer.navLabel.accessibility');
  }

  back(): void {
    this.location.back();
  }
}
