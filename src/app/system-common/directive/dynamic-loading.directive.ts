import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[symDynamicLoading]',
  standalone: false,
})
export class DynamicLoadingDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
