import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { RouteTitleService } from "../../shared/services/route-title.service";
import { StringTransformService } from 'src/app/shared/services/string-transform.service';
import { SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss'],
  imports: [RouterLink, TranslatePipe]
})
export class ImprintComponent implements OnInit {

  readonly imprint: SafeHtml = this.stringTransformService.decodeAndSanitize(environment.imprint);
  readonly version = environment.version;

  constructor(private location: Location, private routeTitle: RouteTitleService, private stringTransformService: StringTransformService) {
  }

  ngOnInit(): void {
    this.routeTitle.setTitle('footer.navLabel.imprint');
  }

  back(): void {
    this.location.back();
  }
}
