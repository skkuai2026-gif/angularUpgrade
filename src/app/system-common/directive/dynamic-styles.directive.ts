import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[symDynamicStyle]',
  standalone: false,
})
export class DynamicStylesDirective implements OnInit, OnDestroy {
  /**
   * CSS styles to be dynamically applied to the element.
   * This should be a string containing the CSS rules to be injected.
   */
  @Input('symDynamicStyle') css: string | null = null;

  /**
   * Unique ID to identify the dynamically created <style> element.
   * This ID ensures that styles are correctly removed when the directive is destroyed or updated.
   */
  @Input('symDynamicStyleId') dynamicStyleId: string | null = null;

  private styleElement: HTMLStyleElement | null = null;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.applyStyles();
  }

  ngOnDestroy(): void {
    this.removeStyles();
  }

  private applyStyles() {
    if (this.css) {
      const head = document.getElementsByTagName('head')[0];
      this.styleElement = document.createElement('style');
      this.styleElement.setAttribute('id', this.dynamicStyleId);
      this.styleElement.type = 'text/css';
      this.styleElement.appendChild(document.createTextNode(this.css));
      head.appendChild(this.styleElement);
    }
  }

  private removeStyles() {
    if (this.styleElement && document.getElementById(this.dynamicStyleId)) {
      this.styleElement.remove();
    }
  }
}
