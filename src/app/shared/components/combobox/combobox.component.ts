import {AfterViewInit, Component, ElementRef, Input, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {NgClass} from "@angular/common";

enum SelectActions {
  Close,
  CloseSelect,
  First,
  Last,
  Next,
  Open,
  PageDown,
  PageUp,
  Previous,
  Type
}

export interface ComboboxOption {
  value: string;
  label?: string;
  callbackArgs?: any;
}

const SEARCH_TIMEOUT_DURATION = 500;
const PAGE_SIZE = 10;

@Component({
  selector: 'app-combobox',
  templateUrl: './combobox.component.html',
  styleUrl: './combobox.component.scss',
  imports: [
    NgClass
  ],
  standalone: true
})
export class ComboboxComponent implements AfterViewInit {
  @Input() label: string = '';
  @Input() options: ComboboxOption[];
  @Input() defaultOptionIndex = 0;
  @Input() callback: (args: any) => void;

  // refs
  @ViewChild('combo') comboElem!: ElementRef<HTMLDivElement>;
  @ViewChild('combobox') comboboxElem!: ElementRef<HTMLDivElement>;
  @ViewChild('listbox') listboxElem!: ElementRef<HTMLDivElement>;
  @ViewChildren('option') optionElems!: QueryList<ElementRef<HTMLDivElement>>;

  // state
  activeIndex = 0;
  isOpen = false;
  searchString = '';
  searchTimeout: ReturnType<typeof setTimeout> = null;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.selectOption(this.defaultOptionIndex);
  }

  /*
   * Events
   */

  protected onBlur(event: FocusEvent) {
    // do nothing if relatedTarget is contained within listboxEl
    if (this.listboxElem.nativeElement.contains(event.relatedTarget as Node)) {
      return;
    }

    // select current option and close
    if (this.isOpen) {
      this.selectOption(this.activeIndex);
      this.setMenuState(false);
    }
  };

  protected onKeyDown(event: KeyboardEvent): void {
    const action = this.getActionFromKey(event);

    // if the event isn't detected as our `action`, then the default browser action needs to happen
    // e.g. a user has the focus on the box and wants to move focus back- or forwards by using the tab-key
    if (typeof action === 'undefined') return;
    if (action !== SelectActions.Type) event.preventDefault();

    switch (action) {
      case SelectActions.First:
      case SelectActions.Last:
        this.isOpen = true;
      // intentional fallthrough
      case SelectActions.Next:
      case SelectActions.Previous:
      case SelectActions.PageUp:
      case SelectActions.PageDown:
        this.setActiveIndex(this.getUpdatedIndex(action));
        break;
      case SelectActions.CloseSelect:
        this.selectOption(this.activeIndex);
        break;
      case SelectActions.Open:
      case SelectActions.Close:
        this.toggleMenuState();
        break;
      case SelectActions.Type:
        this.onType(event.key);
        break;
    }
  }

  private onType(char: string): void {
    this.isOpen = true;
    this.searchString = this.buildSearchString(char);
    const searchIndex = this.getIndexByString(this.searchString);

    if (searchIndex >= 0) {
      this.setActiveIndex(searchIndex);
    } else {
      clearTimeout(this.searchTimeout);
      this.searchString = '';
    }
  }

  /*
   * Helper functions
   */

  protected toggleMenuState(callFocus = true) {
    this.setMenuState(!this.isOpen, callFocus);
  }

  private setMenuState(open: boolean, callFocus = true) {
    if (this.isOpen === open) return;

    this.isOpen = open;
    this.updateOptionVisibility();

    // move focus back to the combobox, if needed
    if (callFocus) {
      this.comboboxElem.nativeElement.focus();
    }
  };

  private setActiveIndex(index: number): void {
    if (typeof index === 'undefined') return;

    this.activeIndex = index;
    this.updateOptionVisibility();
  }

  protected selectOption(index: number): void {
    this.setActiveIndex(index);
    this.setMenuState(false, false);

    const selectedOption = this.options[this.activeIndex];
    if (this.callback) {
      this.callback(selectedOption.callbackArgs);
    }
  }

  private getActionFromKey(event: KeyboardEvent): SelectActions | undefined {
    const {key, altKey, ctrlKey, metaKey} = event;
    const openKeys = ['ArrowDown', 'ArrowUp', 'Enter', ' '];

    if (!this.isOpen && openKeys.includes(key)) {
      return SelectActions.Open;
    }

    if (key === 'Home') return SelectActions.First;
    if (key === 'End') return SelectActions.Last;

    if (key === 'Backspace'
      || key === 'Clear'
      || (key.length === 1 && key !== ' ' && !altKey && !ctrlKey && !metaKey)) {
      return SelectActions.Type;
    }

    if (this.isOpen) {
      if (key === 'ArrowUp' && altKey) return SelectActions.CloseSelect;
      if (key === 'ArrowDown' && !altKey) return SelectActions.Next;
      if (key === 'ArrowUp') return SelectActions.Previous;
      if (key === 'PageUp') return SelectActions.PageUp;
      if (key === 'PageDown') return SelectActions.PageDown;
      if (key === 'Escape') return SelectActions.Close;
      if (key === 'Enter' || key === ' ') return SelectActions.CloseSelect;
    }

    return undefined;
  }

  private buildSearchString(char: string): string {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => this.searchString = '', SEARCH_TIMEOUT_DURATION);
    this.searchString += char;

    return this.searchString;
  }

  private getIndexByString(filter: string): number {
    return this.options.findIndex(option =>
      option.value.toLowerCase()
        .startsWith(filter.toLowerCase()));
  }

  private getUpdatedIndex(action: SelectActions): number {
    const maxIndex = this.options.length > 0
      ? this.options.length - 1
      : 0;

    switch (action) {
      case SelectActions.First:
        return 0;
      case SelectActions.Last:
        return maxIndex;
      case SelectActions.Previous:
        return Math.max(this.activeIndex - 1, 0);
      case SelectActions.Next:
        return Math.min(this.activeIndex + 1, maxIndex);
      case SelectActions.PageUp:
        return Math.max(this.activeIndex - PAGE_SIZE, 0);
      case SelectActions.PageDown:
        return Math.min(this.activeIndex + PAGE_SIZE, maxIndex);
      default:
        return this.activeIndex;
    }
  }

  private updateOptionVisibility(): void {
    if (this.optionElems.length === 0 || !this.isOpen) return;

    // ensure the new option is in view
    if (this.isScrollable(this.listboxElem)) {
      this.maintainScrollVisibility(this.optionElems.get(this.activeIndex), this.listboxElem);
    }

    // ensure the new option is visible on screen
    // ensure the new option is in view
    if (!this.isElementInView(this.optionElems.get(this.activeIndex).nativeElement)) {
      this.optionElems.get(this.activeIndex).nativeElement
        .scrollIntoView({behavior: 'smooth', block: 'nearest'});
    }
  }

  // check if element is visible in browser view port
  private isElementInView(element: HTMLDivElement) {
    const bounding = element.getBoundingClientRect();

    return (
      bounding.top >= 0 &&
      bounding.left >= 0 &&
      bounding.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
      bounding.right <=
      (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  // check if an element is currently scrollable
  private isScrollable(element: ElementRef<HTMLDivElement>) {
    return element && element.nativeElement.clientHeight < element.nativeElement.scrollHeight;
  }

  // ensure a given child element is within the parent's visible scroll area
  // if the child is not visible, scroll the parent
  private maintainScrollVisibility(activeElement: ElementRef<HTMLDivElement>, scrollParent: ElementRef<HTMLDivElement>) {
    const {offsetHeight, offsetTop} = activeElement.nativeElement;
    const {offsetHeight: parentOffsetHeight, scrollTop} = scrollParent.nativeElement;

    const isAbove = offsetTop < scrollTop;
    const isBelow = offsetTop + offsetHeight > scrollTop + parentOffsetHeight;

    if (isAbove) {
      scrollParent.nativeElement.scrollTo(0, offsetTop);
    } else if (isBelow) {
      scrollParent.nativeElement.scrollTo(0, offsetTop - parentOffsetHeight + offsetHeight);
    }
  }
}
