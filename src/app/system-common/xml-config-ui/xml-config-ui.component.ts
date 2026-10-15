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
import { FieldItem } from 'src/app/models/common/field-item';
import { TabItem } from 'src/app/models/common/tab-items';
// import { TabItem } from 'src/app/models/common/tab-items';

declare const enableScroll: any;

@Component({
  selector: 'sym-xml-config-ui',
  templateUrl: './xml-config-ui.component.html',
  styleUrls: ['./xml-config-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class XmlConfigUiComponent implements OnInit {
  /**
   * This is a required Object. It expects XML DOM format Object
   * e.g: This would be a HTMLCollection type.
   */
  @Input() xmlDom: any;

  /**
   * This is provided so that the current service is accesible to the component to reload or re-fresh the
   * search-list if list is updated.
   * e.g : QuotationService
   */
  @Input() service: BaseService;

  /**
   * It is required input. It is of type ResposeIO.
   *
   * It contains the value to be displayed in the UI.
   * @ResponseIO contains JSON Object of { data; metadata; lookups; validationerrors; }
   */
  @Input() responseIO: ResponseIO;

  /**
   * It expects the model from which the fields are to be renderd based on the code
   *
   * e.g: service.responseIO.data.Proposer
   */
  @Input() model: any;

  @Input() responseUpdated: boolean;

  @Input() currIndex: number;

  /**
   * It expects product facet
   */
  @Input() productFacets: any;
  /**
   * It expects company facet
   */
  @Input() companyFacets: any;
  /**
   * It is triggered when there is a event to emitt on field value is changed.
   * @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   *
   */
  @Output() notifyChange = new EventEmitter<FieldItem>();

  /**
   * It is triggered when there is a event to emitt on field value is focused.
   * @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   *
   */
  @Output() notifyFocus = new EventEmitter<FieldItem>();
  /**
   * It is triggered when there is a event to emitt on row added.
   * @number EventEmitter<number> parameter will send number from the called component
   *
   */
  @Output() onRowAdded = new EventEmitter<any>();

  /**
   * It is triggered when there is a event to emitt on more selection.
   * @number EventEmitter<number> parameter will send number from the called component
   *
   */
  @Output() onMoreSelected = new EventEmitter<number>();

  /**
   * It is triggered when it is clicked on search Icon next to the field displayed.
   *  @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   */
  @Output() searchIconClicked = new EventEmitter<FieldItem>();

  /**
   * This event is triggered when a tab-item is selected.
   * It returns @TabITem JSON Object.
   */
  @Output() selectedTab = new EventEmitter<any>();

  /**
   * This event is triggered when add tab-item button is clicked.
   */
  @Output() onTabAdded = new EventEmitter<number>();

  /**
   * This event is triggered when tab-item is deleted.
   */
  @Output() onTabDeleted = new EventEmitter<TabItem>();

  /**
   * This event is triggered when an element has sumClick attribute and is invoked by clicking on the element.
   */
  @Output() onElementClicked = new EventEmitter<any>();

  /**
   * This event is triggered when reload of step is needed.
   */
  @Output() notifyReloadStepOutput = new EventEmitter<any>();

  /**
   * It is triggered when there is a event to emitt on key down of the field.
   * @FieldItem EventEmitter<FieldItem> parameter will send FieldItem JSON Object from the called component
   *
   */
  @Output() notifyKeyDown = new EventEmitter<FieldItem>();

  /**
   * @ignore
   */
  selectedSubTab: { xmlDom: any; index: number };
  /**
   * @ignore
   */
  renderXML: boolean;

  constructor(public baseService: BaseService) {}

  ngOnInit() {
    if (this.xmlDom?.nodeName && this.xmlDom.nodeName === 'tab') {
      this.baseService.isFormReadOnly = this.xmlDom.getAttribute('isFormReadOnly') === 'true';
    }
    this.service.isFormDirty.subscribe((field: FieldItem) => {
      this.refreshDOM();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (
      (changes['responseIO'] && changes['responseIO'].currentValue) ||
      (changes['xmlDom'] && changes['xmlDom'].currentValue) ||
      (changes['productFacets'] && changes['productFacets'].currentValue) ||
      (changes['companyFacets'] && changes['companyFacets'].currentValue)
    ) {
      if (
        (this.service.responseIO === undefined || this.service.responseIO === null) &&
        this.responseIO != undefined
      ) {
        this.service.responseIO = this.responseIO;
      }
      if (
        (this.productFacets === undefined || this.productFacets === null) &&
        this.service['productFacets'] != undefined
      ) {
        this.productFacets = this.service['productFacets'];
      }
      if (
        (this.companyFacets === undefined || this.companyFacets === null) &&
        this.service['companyFacets'] != undefined
      ) {
        this.companyFacets = this.service['companyFacets'];
      }

      this.refreshDOM();
    }
  }

  private refreshDOM() {
    this.renderXML = false;
    let symIfVal: boolean = true;
    let isFeatureApplicable: boolean = true;
    if (this.xmlDom?.getAttribute('symIf') != undefined && this.responseIO != undefined) {
      let exp = this.xmlDom.getAttribute('symIf').includes('symIndex')
        ? this.xmlDom.getAttribute('symIf').replaceAll('symIndex', this.currIndex)
        : this.xmlDom.getAttribute('symIf');
      symIfVal = this.service.isApplicable(exp, this.responseIO, this.productFacets, this.companyFacets);
    }
    if (this.xmlDom?.getAttribute('feature') != undefined) {
      isFeatureApplicable = this.service.checkFeatureIsApplicable(this.xmlDom.getAttribute('feature'));
    }
    //If symIf is true and feature is applicable for Agent then only set element to visible(panel,row,col,etc.)
    if (symIfVal && isFeatureApplicable) this.renderXML = true;

    this.xmlDom.setAttribute('symIfVal', this.renderXML);

    if (this.xmlDom?.children?.length != undefined) {
      for (let i = 0; i < this.xmlDom.children.length; i++) {
        let symIfValChild: boolean = true;
        let isFeatureApplicableChild: boolean = true;
        let renderXMLChild: boolean = false;

        if (this.xmlDom.children[i].getAttribute('symIf') != undefined && this.responseIO != undefined) {
          let exp = this.xmlDom.children[i].getAttribute('symIf').includes('symIndex')
            ? this.xmlDom.children[i].getAttribute('symIf').replaceAll('symIndex', this.currIndex)
            : this.xmlDom.children[i].getAttribute('symIf');

          // this.xmlDom.children[i].setAttribute('symIf', exp);
          symIfValChild = this.service.isApplicable(exp, this.responseIO, this.productFacets, this.companyFacets);
          // console.log(this.xmlDom.children[i].getAttribute('symIf'), val);
          // this.xmlDom.children[i].setAttribute('symIfVal', val);
        }
        if (this.xmlDom.children[i].getAttribute('feature') != undefined) {
          isFeatureApplicableChild = this.service.checkFeatureIsApplicable(
            this.xmlDom.children[i].getAttribute('feature')
          );
        }

        if (symIfValChild && isFeatureApplicableChild) renderXMLChild = true;
        this.xmlDom.children[i].setAttribute('symIfVal', renderXMLChild);
      }
    }
  }

  /**
   * on input field change this method is trigger
   * @param fieldItem item whose value is been changed
   */
  onInputChanged(fieldItem: FieldItem) {
    enableScroll();
    this.notifyChange.emit(fieldItem);
  }

  /**
   * on input field focused this method is trigger
   * @param fieldItem item whose value is been focused
   */
  onInputFocused(fieldItem: FieldItem) {
    enableScroll();
    this.notifyFocus.emit(fieldItem);
  }

  onRowAddedClicked(modelName: string) {
    enableScroll();
    this.onRowAdded.emit(modelName);
  }

  onNotifyChanges(fieldItem: FieldItem) {
    enableScroll();
    this.notifyChange.emit(fieldItem);
  }
  onNotifyFocus(fieldItem: FieldItem) {
    enableScroll();
    this.notifyFocus.emit(fieldItem);
  }
  onMoreSelectedClicked(index) {
    enableScroll();
    this.onMoreSelected.emit(index);
  }

  onSearchIconClick(field: FieldItem) {
    enableScroll();
    this.searchIconClicked.emit(field);
  }

  onReloadStepTriggered(value: any) {
    this.notifyReloadStepOutput.emit(value);
  }

  onSubTabSelected(tab) {
    this.currIndex = tab.index;
    this.selectedTab.emit(tab);
    this.selectedSubTab = tab;
  }

  onTabAdd(index) {
    this.onTabAdded.emit(index);
  }

  onTabDelete(tab) {
    this.onTabDeleted.emit(tab);
  }

  getModelForSubTab(model) {
    if (model.getAttribute('model') != null) {
      return this.service.getModel(model.getAttribute('model'));
    }
  }

  onHTMLElementClick(elementID) {
    this.onElementClicked.emit(elementID);
  }

  getColumnWidth(grid) {
    let columnWidthList = [];
    if (grid != undefined) {
      let colWidth = grid.replace('[', '').replace(']', '').trim();
      colWidth.split(',').forEach((widths) => {
        columnWidthList.push(parseInt(widths));
      });
    }
    return columnWidthList;
  }
  /**
   * @param item a particular field item which is to emitted
   * triggered on the key down of the field item.
   */
  public onKeyDown(item: FieldItem) {
    this.notifyKeyDown.emit(item);
  }
}
