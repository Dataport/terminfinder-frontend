import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Appointment} from '../../models';
import {LinkGeneratorService} from "../../services/utils/link-generator.service";

@Component({
  selector: 'app-appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss']
})

export class AppointmentSummaryComponent implements OnInit, AfterViewInit {
  moreButtonRequired = true;
  absoluteAppointmentUrl: string = '';

  @Input() appointment: Appointment;
  @Input() showUsername = true;
  @Input() showAppointmentUrl = false;
  @ViewChild('description', {static: false}) descriptionElement: ElementRef;

  constructor(
    private linkGeneratorService: LinkGeneratorService
  ) {
  }

  ngOnInit(): void {
    this.absoluteAppointmentUrl = this.linkGeneratorService.generateAbsoluteAppointmentLink();
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
