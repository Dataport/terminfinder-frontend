import {Component} from '@angular/core';
import {Location} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {BomFile, LicenseSummary} from '../../shared/models';

type AmountOfLicencesElement = { license: string, amount: number }

@Component({
  selector: 'app-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss']
})
export class BomComponent {

  amountOfLicences: AmountOfLicencesElement[] = [{license: 'Keine Lizenz gefunden', amount: 0}];
  summary: LicenseSummary[] = [];

  constructor(private location: Location, private http: HttpClient) {
    this.http.get<BomFile>('./sbom.json').subscribe((licenses) => {
      licenses.components.sort((a, b) => (a.group + a.name).localeCompare(b.group + b.name));
      licenses.components.forEach(component => {
        let name = '';
        if (component.group) {
          name += component.group + '/';
        }
        name += component.name;

        let element: LicenseSummary = {
          packageName: name,
          author: component.author,
          licenses: []
        };

        component.licenses?.forEach((license) => {
          element.licenses.push(license.license);

          let currentLicence = undefined;
          if (license.license !== undefined) {
            currentLicence = license.license.id ? license.license.id : license.license.name;
          }
          if (currentLicence === undefined && license.expression !== undefined) {
            currentLicence = license.expression;
          }
          if (currentLicence === undefined) {
            console.log(component);
          }
          if (this.amountOfLicences.some(e => e.license === currentLicence)) {
            this.amountOfLicences.filter(e => e.license === currentLicence)[0].amount += 1;
          } else {
            this.amountOfLicences.push({license: currentLicence, amount: 1});
          }
        });
        this.summary.push(element);
      });
      console.log('amount: ', this.amountOfLicences);
    });
  }

  back(): void {
    this.location.back();
  }
}
