import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  @Input() forwardText: string;
  @Input() backwardText: string;
  @Input() hasBackwardButton: boolean;
  @Input() hasForwardButton: boolean;
  @Input() isInvalid: boolean;
  @Output() backward = new EventEmitter();
  @Output() forward = new EventEmitter();

  constructor() {
  }

  onBack() {
    this.backward.emit();
  }

  onSubmit() {
    this.forward.emit();
  }
}
