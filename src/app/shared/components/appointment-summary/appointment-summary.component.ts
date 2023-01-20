import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';
import {Appointment} from '../../models';

@Component({
  selector: 'app-appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss']
})

export class AppointmentSummaryComponent implements AfterViewInit {
  moreButtonRequired = true;

  @Input() appointment: Appointment;
  @Input() showUsername = true;
  @ViewChild('description', {static: false}) descriptionElement: ElementRef;

  constructor() {
  }

  ngAfterViewInit(): void {
    Promise.resolve(null).then(() => {
      const elem = this.descriptionElement;
      if (elem) {
        const scrollHeight: number = elem.nativeElement.scrollHeight;
        const height: number = elem.nativeElement.clientHeight;
        this.moreButtonRequired = scrollHeight > height;
      }
    });
  }

  getDescription(): string {
    return this.appointment.description.replace(/\n\r?/g, '<br/>');
  }
}
