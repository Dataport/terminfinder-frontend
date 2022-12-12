import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-imprint',
  templateUrl: './imprint.component.html',
  styleUrls: ['./imprint.component.scss']
})
export class ImprintComponent {

  imprint = environment.imprint;
  version = environment.version;

  constructor(private location: Location) {
  }

  back(): void {
    this.location.back();
  }
}
