import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {environment} from '../../../environments/environment';
import {RouteTitleService} from "../../shared/services/route-title.service";

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss']
})
export class AccessibilityComponent implements OnInit {
  title = environment.title;
  accessibility = environment.accessibility;

  constructor(private location: Location, private routeTitle: RouteTitleService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('footer.navLabel.accessibility');
  }

  back(): void {
    this.location.back();
  }
}
