import {Component, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {environment} from '../../../environments/environment';
import {RouteTitleService} from "../../shared/services/route-title.service";

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss']
})
export class ImprintComponent implements OnInit {

  imprint = environment.imprint;
  version = environment.version;

  constructor(private location: Location, private routeTitle: RouteTitleService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('footer.navLabel.imprint');
  }

  back(): void {
    this.location.back();
  }
}
