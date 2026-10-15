import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';

@Component({
  selector: 'sym-policy-xml-question-set',
  templateUrl: './policy-xml-question-set.component.html',
  styleUrls: ['./policy-xml-question-set.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyXmlQuestionSetComponent extends BaseComponent<PolicyService> implements OnInit {
  /**
   * This is a required Object. It expects XML DOM format Object
   * e.g: This would be a HTMLCollection type.
   */
  @Input() xmlDom: any;

  @Input() questionSet: any;

  @Input() currIndex;
  @Input() partyGuid;
  @Input() questionSetCd;
  @Input() parentReferencePath: String;
  @Input() isUpperCaseReq;

  renderXML: boolean;

  @Output() notifyChange = new EventEmitter<any>();
  @Output() notifyFocus = new EventEmitter<any>();
  /**
   * This event is triggered when an element has sumClick attribute and is invoked by clicking on the element.
   */
  @Output() onElementClicked = new EventEmitter<any>();

  domElm: any;
  constructor(public policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (changes['xmlDom'] && changes['xmlDom'].currentValue) {
      this.refreshDOM();
    }
  }
  private refreshDOM() {
    this.renderXML = true;
    this.service.isXMLCodeRendered = true;
    if (this.xmlDom?.getAttribute('symIf') != undefined && this.service.responseIO != undefined) {
      let exp = this.xmlDom.getAttribute('symIf').includes('symIndex')
        ? this.xmlDom.getAttribute('symIf').replaceAll('symIndex', this.currIndex)
        : this.xmlDom.getAttribute('symIf');
      this.renderXML = this.service.isApplicable(
        exp,
        this.service.responseIO,
        this.service.productFacets,
        this.service.companyFacets
      );
    }
    this.xmlDom.setAttribute('symIfVal', this.renderXML);
    if (this.xmlDom?.children?.length != undefined) {
      for (let i = 0; i < this.xmlDom.children.length; i++) {
        if (this.xmlDom.children[i].getAttribute('symIf') != undefined && this.service.responseIO != undefined) {
          let exp = this.xmlDom.children[i].getAttribute('symIf').includes('symIndex')
            ? this.xmlDom.children[i].getAttribute('symIf').replaceAll('symIndex', this.currIndex)
            : this.xmlDom.children[i].getAttribute('symIf');

          // this.xmlDom.children[i].setAttribute('symIf', exp);
          let val = this.service.isApplicable(
            exp,
            this.service.responseIO,
            this.service.productFacets,
            this.service.companyFacets
          );
          // console.log(this.xmlDom.children[i].getAttribute('symIf'), val);
          this.xmlDom.children[i].setAttribute('symIfVal', val);
        } else {
          this.xmlDom.children[i].setAttribute('symIfVal', true);
        }

        if (this.xmlDom.children[i].nodeName === 'field') {
          for (let i = 0; i < this.questionSet.questions.length; i++) {
            this.questionSet.questions['isXMLCodeRendered'] = true;
          }
        }
      }
    }
  }

  onHTMLElementClick(elemID) {
    this.onElementClicked.emit(elemID);
  }

  getColClass(col) {
    let width = col.getAttribute('width') != undefined ? col.getAttribute('width') : 6;
    return ' col-sm-' + width + ' col-md-' + width + ' co-lg-' + width + ' col-xl-' + width + ' p-1 pr-3';
  }
  onQuestionChanged(eve) {
    this.notifyChange.emit(eve);
  }
}
