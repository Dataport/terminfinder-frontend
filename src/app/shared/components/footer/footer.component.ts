import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { StringTransformService } from '../../services/string-transform.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: false
})
export class FooterComponent {

  readonly email = this.stringTransformService.decodeAndSanitize(environment.email);
  showReference = environment.showReference;

  constructor(private stringTransformService: StringTransformService) {
  }

}
