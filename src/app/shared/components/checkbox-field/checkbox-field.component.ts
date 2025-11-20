import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {NoopValueAccessorDirective} from "../../directives/noop-value-accessor.directive";
import {ReactiveFormsModule} from "@angular/forms";
import {injectNgControl} from "../../utils/inject-ng-control";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-checkbox-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NoopValueAccessorDirective],
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet
  ],
  template: `
    <div class="form-check">
      <input
        [required]="required"
        [formControl]="ngControl.control"
        id="checkbox"
        data-id="checkbox"
        class="form-check-input"
        type="checkbox"
        value=""
        [attr.aria-describedby]="ariaDescribedBy"
      >
      <label for="checkbox" class="form-check-label w-100 multiline">
        @if (labelTemplate) {
          <ng-container *ngTemplateOutlet="labelTemplate"></ng-container>
        } @else {
          {{ label }}
        }
      </label>
    </div>
  `,
  styleUrl: 'checkbox-field.component.scss'
})
export class CheckboxFieldComponent {
  protected ngControl = injectNgControl();

  @Input()
  label = '';
  @Input()
  labelTemplate: TemplateRef<any> | undefined;
  @Input()
  ariaDescribedBy = '';
  @Input()
  required: string = null;
}
