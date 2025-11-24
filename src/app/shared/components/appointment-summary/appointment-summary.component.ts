import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {Appointment} from '../../models';
import {LinkGeneratorService} from "../../services/generators";
import { ClipboardModule } from 'ngx-clipboard';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-appointment-summary',
  templateUrl: './appointment-summary.component.html',
  styleUrls: ['./appointment-summary.component.scss'],
  imports: [ClipboardModule, NgbTooltip, TranslatePipe]
})

export class AppointmentSummaryComponent implements OnInit, AfterViewInit {
  moreButtonRequired = true;
  absoluteAppointmentUrl: string = '';

  @Input() appointment: Appointment;
  @Input() showUsername = true;
  @Input() showAppointmentUrl = false;
  @Input() showDeleteWarning = false;
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
