import { Component, Input } from '@angular/core';
import { Message, MessageType } from '../../models';
import { NullableUtils } from '../../utils';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
  imports: [NgClass]
})
export class MessageBoxComponent {
  isError = false;
  isWarning = false;
  isInfo = false;
  isSuccess = false;

  _message: Message = { message: '', messageType: MessageType.UNDEFINED };

  @Input()
  set message(message: Message) {
    this._message = message;
    // TODO: Is there a simple way? ngClass expects boolean values.
    this.isError = this.detectIsError();
    this.isWarning = !this.isError ? this.detectIsWarning() : false;
    this.isInfo = !this.isError ? this.detectIsInfo() : false;
    this.isSuccess = !this.isError ? this.detectIsSuccess() : false;
  }

  private detectIsError(): boolean {
    return (
      NullableUtils.isObjectNullOrUndefined(this._message) ||
      NullableUtils.isObjectNullOrUndefined(this._message.messageType) ||
      this._message.messageType === MessageType.ERROR ||
      this._message.messageType === MessageType.UNDEFINED
    );
  }

  private detectIsWarning(): boolean {
    return this._message.messageType === MessageType.WARNING;
  }

  private detectIsSuccess(): boolean {
    return this._message.messageType === MessageType.SUCCESS;
  }

  private detectIsInfo(): boolean {
    return this._message.messageType === MessageType.INFO;
  }
}
