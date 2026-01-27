import { Component, OnInit, inject } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '../../../environments/environment';
import { RouteTitleService } from '../../shared/services/route-title.service';
import { SafeHtml } from '@angular/platform-browser';
import { StringTransformService } from 'src/app/shared/services/string-transform.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss'],
  imports: [TranslatePipe]
})
export class AccessibilityComponent implements OnInit {
  private location = inject(Location);
  private routeTitle = inject(RouteTitleService);
  private stringTransformService = inject(StringTransformService);

  readonly title = environment.title;
  readonly accessibility: SafeHtml = this.stringTransformService.decodeAndSanitize(environment.accessibility);

  ngOnInit(): void {
    this.routeTitle.setTitle('footer.navLabel.accessibility');
  }

  back(): void {
    this.location.back();
  }
}
