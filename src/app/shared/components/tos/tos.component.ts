import {Component, Input} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-tos',
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.scss']
})
export class TosComponent {
  @Input() tosFormGroup: FormGroup;

  constructor() {
  }

  get isTosRead() {
    return this.tosFormGroup.controls.isTosRead as FormControl;
  }

}
