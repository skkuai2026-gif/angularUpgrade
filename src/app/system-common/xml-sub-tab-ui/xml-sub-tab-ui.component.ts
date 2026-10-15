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
import { TabItem } from 'src/app/models/common/tab-items';
import { SettingService } from '../services/setting.service';
@Component({
  selector: 'sym-xml-sub-tab-ui',
  templateUrl: './xml-sub-tab-ui.component.html',
  styleUrls: ['./xml-sub-tab-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class XmlSubTabUiComponent implements OnInit {
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

  @Input() itemSubTabTpl;

  /**
   * It expect the model list
   *
   * e.g: service.responseIO.data.WithdrawalList
   */
  @Input() modelList: any[];

  /**
   * It expects product facet
   */
  @Input() productFacets: any;
  /**
   * It expects company facet
   */
  @Input() companyFacets: any;

  /**
   * This event is triggered when a tab-item is selected.
   * It returns @TabITem JSON Object.
   */
  @Output() selectedTab = new EventEmitter<any>();

  /**
   * This event is triggered when add tab-item button is clicked.
   */
  @Output() onTabAdded = new EventEmitter<any>();

  /**
   * This event is triggered when tab-item is deleted.
   */
  @Output() onTabDeleted = new EventEmitter<TabItem>();

  highLightedTab: { xmlDom: any; index: number };
  isTabAdded: boolean;

  constructor(public baseService: BaseService, public settingService: SettingService) {
    this.isTabAdded = false;
  }

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.

    if (changes['xmlDom'] && changes['xmlDom'].currentValue) {
      // console.log(this.xmlDom);
      // console.log(this.modelList);
    }

    if (changes['xmlDom'] && changes['xmlDom'].firstChange) {
      // console.log(this.xmlDom);
      if (this.xmlDom.getAttribute('isStatic') === true || this.xmlDom.getAttribute('isStatic') === 'true') {
        this.onTabSelected(this.xmlDom.children[0], 0);
      } else {
        this.onTabSelected(this.service.getModel(this.xmlDom.getAttribute('model'))[0], 0);
      }
      // this.service.getModel();
    }

    if (
      (changes['responseIO'] && changes['responseIO'].currentValue) ||
      (changes['modelList'] && changes['modelList'].currentValue)
    ) {
      if (this.highLightedTab === undefined) {
        if (this.xmlDom.getAttribute('isStatic') === true || this.xmlDom.getAttribute('isStatic') === 'true') {
          this.onTabSelected(this.xmlDom.children[0], 0);
        } else {
          this.onTabSelected(this.service.getModel(this.xmlDom.getAttribute('model'))[0], 0);
        }
      } else {
        if (this.modelList != undefined) {
          for (let i = this.modelList.length - 1; i >= 0; --i) {
            if (this.modelList[i].status !== 'D' && this.highLightedTab.index == i && !this.isTabAdded) {
              this.onTabSelected(this.modelList[i], i);
              break;
            } else if (this.modelList[i].status !== 'D' && this.isTabAdded) {
              this.onTabSelected(this.modelList[i], i);
              this.isTabAdded = false;
              break;
            } else if (this.highLightedTab.index == i) {
              this.onTabSelected(this.modelList[i], i);
              break;
            } else {
              this.onTabSelected(this.modelList[i], i);
            }
          }
        }
      }
      // console.log(this.modelList);
    }
  }

  onTabSelected(element, index) {
    if (element != undefined) {
      let selected = { xmlDom: element.guid == undefined ? element : this.xmlDom, index: index };
      this.highLightedTab = selected;
      this.selectedTab.emit(selected);
    }
  }

  isSymAvailable(expString: string) {
    if (expString === undefined || expString == null) return;
    // console.log(expString);
    if (expString.includes('symIf:')) {
      let exp = expString.substring(expString.indexOf(':') + 1, expString.length);
      return this.baseService.isApplicable(exp, this.responseIO, this.productFacets, this.companyFacets);
    } else if (expString === 'true') {
      return true;
    }
    return false;
  }

  onAddSelected(event) {
    this.isTabAdded = true;
    this.onTabAdded.emit(event);
  }

  onTabDelete(model, name, index) {
    let options = {
      okCallBack: () => {
        let tabItem = new TabItem();
        tabItem.text = name;
        tabItem.id = model.guid;
        tabItem.index = index;
        tabItem.visible = false;
        this.service.setDeleted(model);
        this.onTabDeleted.emit(tabItem);
        if (this.modelList != undefined) {
          for (let i = this.modelList.length - 1; i >= 0; --i) {
            if (this.modelList[i].status !== 'D') {
              this.onTabSelected(this.modelList[i], i);
              break;
            }
          }
        }
      },
      cancelCallBack: () => {},
      isConfirmationAlert: true,
    };
    this.baseService.settingService.alertService.confirm(
      this.service.getMultilingualMessage('deleteConfirmation', [name]),
      options
    );
  }

  /**
   * This will be triggered when a item is selected to delete
   * @param rowIndex index of item to be deleted in the list displayed
   * @param event type event which is triggered on click
   */
  onDeleteSelected(rowIndex: number, event: any): void {
    // this.tabList.splice(tabItem.index, 1);
  }
}
