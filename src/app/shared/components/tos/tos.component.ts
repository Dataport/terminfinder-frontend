import { Component, input } from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CheckboxFieldComponent } from '../checkbox-field/checkbox-field.component';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-tos',
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.scss'],
  imports: [
    CheckboxFieldComponent,
    ReactiveFormsModule,
    RouterLink,
    TranslatePipe
  ]
})
export class TosComponent {
  readonly tosFormGroup = input<UntypedFormGroup>(undefined);

  constructor() {}

  get isTosRead() {
    return this.tosFormGroup().controls.isTosRead as UntypedFormControl;
  }
}
