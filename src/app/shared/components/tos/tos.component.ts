import {Component, Input} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {TranslateModule} from "@ngx-translate/core";
import {RouterLink} from "@angular/router";
import {CheckboxFieldComponent} from "../checkbox-field/checkbox-field.component";

@Component({
  selector: 'app-tos',
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.scss'],
  standalone: true,
  imports: [
    CheckboxFieldComponent,
    ReactiveFormsModule,
    RouterLink,
    TranslateModule,
  ]
})
export class TosComponent {
  @Input() tosFormGroup: UntypedFormGroup;

  constructor() {
  }

  get isTosRead() {
    return this.tosFormGroup.controls.isTosRead as UntypedFormControl;
  }

}
