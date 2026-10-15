import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { BaseService } from '../services/base.service';
import { ResponseIO } from 'src/app/models/responseIO';
const re = new RegExp('{{(.+?)}}');
@Component({
  selector: 'sym-xml-html-ui',
  templateUrl: './xml-html-ui.component.html',
  styleUrls: ['./xml-html-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class XmlHtmlUiComponent implements OnInit {
  @Input() html: any;
  @Input() service: BaseService;
  @Input() responseIO: ResponseIO;
  /**
   * It expects product facet
   */
  @Input() productFacets: any;
  /**
   * It expects company facet
   */
  @Input() companyFacets: any;

  /**
   * it contain current index for XML
   */
  @Input() symIndex: number;

  /**
   * This event is triggered when an element has sumClick attribute and is invoked by clicking on the element.
   */
  @Output() onElementClicked = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['html'] && changes['html'].currentValue) {
      if (re.test(this.html.outerHTML)) {
        //To handle expression change error in html after load of XML. (ExpressionChangedAfterItHasBeenCheckedError: Expression has changed after it was checked.)
        this.html['outerHTMLDis'] = this.getHTMLEvaluated(this.html.outerHTML, this.responseIO);
        this.html['outerHTMLDis'] = this.getHTMLLabelEvaluated(this.html['outerHTMLDis']);
      } else {
        this.html['outerHTMLDis'] = this.html.outerHTML;
      }

      if (this.html.getAttribute('symClick')) {
        setTimeout(() => {
          var buttonObj = document.getElementById(this.html.getAttribute('id'));
          if (buttonObj != undefined) {
            buttonObj.addEventListener('click', this.onClickDynamicElement.bind(event), false);
          }
        }, 100);
      }
    }
  }

  onClickDynamicElement(event) {
    $('#dynamicElementClick').val(event.target.id);
    $('#dynamicElementClick').trigger('click');
  }

  onDynamicElemnentClick() {
    let elemID = $('#dynamicElementClick').val();
    this.onElementClicked.emit(elemID);
  }

  getHTMLEvaluated(htmlExpression: string, responseIO: ResponseIO): any {
    if (htmlExpression == undefined || responseIO == undefined) return;
    try {
      if (re.test(htmlExpression) && (htmlExpression.includes('data.') || htmlExpression.includes('eval'))) {
        while (re.test(htmlExpression)) {
          let result = re.exec(htmlExpression);
          if (result[1].trim().includes('eval')) {
            try {
              htmlExpression = this.evaluateXMLExpression(result, htmlExpression);
            } catch (error) {
              console.log(error.message);
              break;
            }
          } else
            htmlExpression = htmlExpression.replace(
              result[0].trim(),
              Function('responseIO', 'return ' + result[1].trim().replace('data.', 'responseIO.data.'))(responseIO)
            );
        }
        return htmlExpression;
      }
    } catch (error) {}
    return htmlExpression;
  }

  getHTMLLabelEvaluated(htmlExpression: string): any {
    if (htmlExpression == undefined) return;
    try {
      if (re.test(htmlExpression) && htmlExpression.includes('symLabel.')) {
        while (re.test(htmlExpression)) {
          let result = re.exec(htmlExpression);
          let label = this.service.getMultilingualLabel(result[1].trim().replace('symLabel.', ''));
          htmlExpression = htmlExpression.replace(result[0].trim(), label);
        }
        return htmlExpression;
      }
    } catch (error) {}
    return htmlExpression;
  }

  private evaluateXMLExpression(result: any, htmlExpression: string): string {
    let htmlExp = htmlExpression;
    const expression = result[1].trim(); // Extract the dynamic eval expression.

    // Match and extract the function call inside eval, e.g., "getSysDate('yyyy/MM/dd')"
    const match = expression.match(/eval\((.+)\)/);
    if (match) {
      const functionCall = match[1].trim(); // e.g., "getSysDate('yyyy/MM/dd')"

      // Extract function name and arguments using regex
      const funcMatch = functionCall.match(/(\w+)\((.*)\)/);
      if (funcMatch) {
        const functionName = funcMatch[1]; // e.g., "getSysDate"
        let functionArgs = funcMatch[2]; // e.g., "'yyyy/MM/dd'"

        if (functionArgs.includes('data'))
          functionArgs = functionArgs.replace(/data\.(\w+)/g, (_: any, property: any) => {
            return `responseIO.data.${property}`;
          });

        // Dynamically construct and execute the function

        const dynamicFunction = this.service[functionName];
        if (typeof dynamicFunction === 'function') {
          // Parse arguments and execute the function
          const args = functionArgs.split(',').map((arg) => eval(arg.trim())); // Safely parse arguments

          // Replace the eval expression with the function's return value
          htmlExp = htmlExpression.replace(
            result[0].trim(),
            Function(
              'service',
              `return service.${functionName}(${args.map((arg) => JSON.stringify(arg)).join(',')});`
            )(this.service)
          );
        }
        if (htmlExp === htmlExpression) throw new Error('Check expression');
        return htmlExp;
      }
    }
  }
}
