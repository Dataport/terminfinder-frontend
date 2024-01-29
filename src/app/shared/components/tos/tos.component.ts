import {Component, Input} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';

@Component({
  selector: 'app-tos',
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.scss']
})
export class TosComponent {
  @Input() tosFormGroup: UntypedFormGroup;

  constructor() {
  }

  get isTosRead() {
    return this.tosFormGroup.controls.isTosRead as UntypedFormControl;
  }

}
