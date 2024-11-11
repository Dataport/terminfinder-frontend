import {Injectable} from "@angular/core";
import {TranslateService} from "@ngx-translate/core";
import {Title} from "@angular/platform-browser";
import {environment} from "../../../environments/environment";
import {NullableUtils} from "../utils";

@Injectable({
  providedIn: 'root'
})
export class RouteTitleService {
  constructor(private translate: TranslateService, private titleService: Title) {
  }

  /**
   * Prepends the translated key to the environment title
   * @param localeKey Key which gets translated
   * @param appendix String which gets appended to the translated key. A space-char gets put in between!
   */
  setTitle(localeKey: string, appendix: string | null = null): void {
    let routeTitle = this.translate.instant(localeKey);
    if (!routeTitle || routeTitle === localeKey) return;

    if (!NullableUtils.isStringNullOrWhitespace(appendix)) {
      routeTitle += ` ${appendix}`;
    }

    if (!NullableUtils.isStringNullOrWhitespace(environment.title)){
      this.titleService.setTitle(`${routeTitle} - ${environment.title}`);
    } else {
      this.titleService.setTitle(routeTitle);
    }
  }
}
