import { Component, EventEmitter, Output, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [NgClass]
})
export class NavigationComponent {
  readonly forwardText = input<string>(undefined);
  readonly backwardText = input<string>(undefined);
  readonly hasBackwardButton = input<boolean>(undefined);
  readonly hasForwardButton = input<boolean>(undefined);
  readonly isInvalid = input<boolean>(undefined);
  @Output() backward = new EventEmitter();
  @Output() forward = new EventEmitter();

  constructor() {}

  onBack() {
    this.backward.emit();
  }

  onSubmit() {
    this.forward.emit();
  }
}
