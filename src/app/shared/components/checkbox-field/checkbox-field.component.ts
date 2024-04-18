import {ChangeDetectionStrategy, Component, Input, TemplateRef} from '@angular/core';
import {NoopValueAccessorDirective} from "../../directives/noop-value-accessor.directive";
import {ReactiveFormsModule} from "@angular/forms";
import {injectNgControl} from "../../utils/inject-ng-control";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-checkbox-field',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [NoopValueAccessorDirective],
  imports: [
    ReactiveFormsModule,
    NgTemplateOutlet
  ],
  template: `
    <div class="form-check" data-id="tos">
      <input [formControl]="ngControl.control" id="tos" data-id="tosCheckbox" class="form-check-input" type="checkbox"
             value="">
      <label for="tos" class="form-check-label">
        @if (labelTemplate) {
          <ng-container *ngTemplateOutlet="labelTemplate"></ng-container>
        } @else {
          {{ label }}
        }
      </label>
    </div>
  `,
  styleUrl: 'checkbox-field.component.scss',
})
export class CheckboxFieldComponent {
  protected ngControl = injectNgControl();

  @Input()
  label = '';
  @Input()
  labelTemplate: TemplateRef<any> | undefined;
}
