import {Component, Input} from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

const STEPS: number[] = [0, 1, 2, 3];

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  imports: [NgClass, TranslatePipe]
})
export class StepperComponent {
  @Input() currentStep: number;

  constructor() {
  }

  // noinspection JSMethodCanBeStatic
  /**
   * this can not be static, because the .HTML part only has access to an instance of this class at runtime
   * since it has no access to the class itself, it also has no access to it's static members
   */
  public get steps(): number[] {
    return STEPS;
  }

}
