import { Component, OnInit, inject } from '@angular/core';
import { environment } from "../../../environments/environment";
import { Location } from "@angular/common";
import { RouteTitleService } from "../../shared/services/route-title.service";
import { StringTransformService } from 'src/app/shared/services/string-transform.service';
import { SafeHtml } from '@angular/platform-browser';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-of-service',
  templateUrl: './terms-of-service.component.html',
  styleUrls: ['./terms-of-service.component.scss'],
  imports: [TranslatePipe]
})
export class TermsOfServiceComponent implements OnInit {
  private location = inject(Location);
  private routeTitle = inject(RouteTitleService);
  private stringTransformService = inject(StringTransformService);

  readonly termsOfService: SafeHtml = this.stringTransformService.decodeAndSanitize(environment.termsOfService);

  ngOnInit(): void {
    this.routeTitle.setTitle('tos.tos');
  }

  back(): void {
    this.location.back();
  }
}
