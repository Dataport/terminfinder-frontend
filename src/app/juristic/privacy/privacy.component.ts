import { Component, OnInit, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';
import { RouteTitleService } from '../../shared/services/route-title.service';
import { SafeHtml } from '@angular/platform-browser';
import { StringTransformService } from 'src/app/shared/services/string-transform.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss'],
  imports: [TranslatePipe]
})
export class PrivacyComponent implements OnInit {
  private location = inject(Location);
  private routeTitle = inject(RouteTitleService);
  private stringTransformService = inject(StringTransformService);

  readonly privacy: SafeHtml = this.stringTransformService.decodeAndSanitize(environment.privacy);

  ngOnInit(): void {
    this.routeTitle.setTitle('privacy.declaration');
  }

  back(): void {
    this.location.back();
  }
}
