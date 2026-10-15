import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector: '[symRunScripts]',
  standalone: false,
})
export class RunScriptsDirective implements OnInit {
  /**
   * Creates an instance of the directive.
   *
   * @param elementRef - Provides access to the DOM element where the directive is applied.
   * This allows the directive to interact with the element's content.
   */
  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.executeScripts();
  }

  /**
   * Executes all <script> elements found within the directive's host element.
   *
   * This method extracts script content, creates new <script> elements, and appends them
   * to the document's <head> to ensure they are executed. After execution, the temporary
   * <script> elements are removed from the document.
   */
  private executeScripts() {
    const scripts = this.elementRef.nativeElement.getElementsByTagName('script');

    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const newScript = document.createElement('script');
      newScript.text = script.textContent || '';
      document.head.appendChild(newScript).parentNode.removeChild(newScript);
    }
  }
}
