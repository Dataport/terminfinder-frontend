import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-accessibility',
  templateUrl: './accessibility.component.html',
  styleUrls: ['./accessibility.component.scss']
})
export class AccessibilityComponent {

  title = environment.title;
  accessibility = environment.accessibility;

  constructor(
    private location: Location
  ) {
  }

  back(): void {
    this.location.back();
  }
}
