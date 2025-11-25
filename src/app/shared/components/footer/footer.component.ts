import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { StringTransformService } from '../../services/string-transform.service';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [NgOptimizedImage, RouterLink, TranslatePipe]
})
export class FooterComponent {

  readonly email = this.stringTransformService.decodeAndSanitize(environment.email);
  showReference = environment.showReference;

  constructor(private stringTransformService: StringTransformService) {
  }

}
