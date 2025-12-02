import { Pipe, PipeTransform, inject } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeUrl',
})
export class SanitizeUrlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: any): any {
    return this.sanitizer.bypassSecurityTrustResourceUrl(value);
  }
}
