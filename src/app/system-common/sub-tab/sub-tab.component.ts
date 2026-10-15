import { TabItem } from 'src/app/models/common/tab-items';

import {
  Component,
  Input,
  OnInit,
  EventEmitter,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
  // ComponentFactoryResolver,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SettingService } from '../services/setting.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { BaseService } from '../services/base.service';
@Component({
  selector: 'sym-sub-tab',
  templateUrl: './sub-tab.component.html',
  styleUrls: ['./sub-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class SubTabComponent extends BaseComponent<BaseService> implements OnInit {
  /**
   * It expects TabItem JSON Object
   * By default all tabs are visible.
   * e.g: Supplementary 1,Supplementary 2
   */
  @Input() tabList: TabItem[];

  /**
   * This expects boolean value that decides if the tab should have delete option or not.
   * default value is false.
   */
  @Input() isDeleteRequired: boolean;

  /**
   * This option expects boolean value which allows to add tab-item.
   * Default is false.
   */
  @Input() isAddRequired: boolean;
  /**
   * This option expects custamize button key in string format which will be displayed on Add button
   * e.g : 'add'
   */
  @Input() customAddBtnKey: string;
  /**
   * This option expects boolean value which allows to show the dynamic tab.
   */
  @Input() isDynamicTabsReq: boolean;
  /**
   * This option expects number value which allows to set max-height of sub tab content.
   * and this will add scroll to sub tab content.
   */
  @Input() heightSubTab: number;
  /**
   * This event is triggered when a tab-item is selected.
   * It returns @TabITem JSON Object.
   */
  @Output() selectedTab = new EventEmitter<TabItem>();

  /**
   * This event is triggered when add tab-item button is clicked.
   */
  @Output() onTabAdded = new EventEmitter<number>();

  /**
   * This event is triggered when tab-item is deleted.
   */
  @Output() onTabDeleted = new EventEmitter<any>();

  /**
   * @ignore
   */
  isTabsReqd: boolean;

  /**
   * @ignore
   */
  isContentDisplayed: boolean;

  /**
   * @ignore
   */
  maxTextLength: number;

  /**
   * @ignore
   */
  maxLength: number;

  /**
   * @ignore
   */
  currentTextLength: number;

  /**
   * @ignore
   */
  addBtnId: string;

  /**
   * @ignore
   */

  private isAddBtnClicked: boolean;

  constructor(public settingService: SettingService, public baseService: BaseService) {
    super(baseService);

    /**
     * setting default value as 'false' to hide 'Add' and 'Delete(x)' button
     */
    this.isAddRequired = false;
    this.isDeleteRequired = false;
    this.isTabsReqd = false;
    this.isContentDisplayed = true;
    //ReucedForm = false;
    this.maxTextLength = 40;
    this.maxLength = 27;
    this.addBtnId = Math.random().toString(16); //generate a random number for the btn id since this is required to be unique in case there are 2 sub tab components.
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['tabList'] && changes['tabList'].currentValue) {
      // console.log(this.tabList[0].visible);
      /**
       * isAnyTabSelected variable checks if any tab is selected if its visible property is true
       * visibleCounter is used to check if all the tab in the list is visible or not
       */
      let isAnyTabSelected: boolean = false;
      let visibleCounter = -1;
      this.currentTextLength = 0;
      this.tabList.filter((tab) => {
        if (tab.visible == undefined) {
          tab.visible = true;
        }
        if (tab.isSelected && tab.visible) {
          isAnyTabSelected = true;
        }
        if (!tab.visible) {
          visibleCounter++;
        }
        let text =
          this.settingService.getLabelValue(tab.text) != undefined
            ? this.settingService.getLabelValue(tab.text)
            : this.settingService.getLabelValue(tab.id);
        if (this.settingService.getLabelValue(tab.id) || this.settingService.getLabelValue(tab.text)) {
          this.currentTextLength +=
            this.settingService.getLabelValue(tab.id) != undefined
              ? this.settingService.getLabelValue(tab.id).length
              : this.settingService.getLabelValue(tab.text).length;
        }
        // console.log(this.textLength);
        tab.shortText = text.charAt(0) + ' ' + (text.indexOf(' ') != -1 ? text.charAt(text.indexOf(' ') + 1) : '');
        // console.log(tab.shortText);
      });

      if (!isAnyTabSelected) {
        this.displaySelected();
      }

      if (visibleCounter != -1 && visibleCounter == this.tabList.length - 1) {
        this.isContentDisplayed = false;
      }
    }
    if (
      (changes['tabList'] && changes['tabList'].currentValue) ||
      (changes['isAddRequired'] && changes['isAddRequired'].currentValue) ||
      (changes['isDeleteRequired'] && changes['isDeleteRequired'].currentValue)
    ) {
      if (this.isDynamicTabsReq != undefined) {
        this.isTabsReqd = this.isDynamicTabsReq;
      } else if ((this.tabList && this.tabList.length > 1) || this.isAddRequired || this.isDeleteRequired) {
        this.isTabsReqd = true;
      }
    }
    if (this.isAddBtnClicked == true && this.isAddRequired == true) {
      this.setTimeoutPromise(() => {
        this.scrollToTop();
        this.setTimeoutPromise(() => {
          this.setNextFieldFocus(
            undefined,
            undefined,
            $('#btn_subTab_' + this.addBtnId)
              .closest('.innerHorizontalTab')
              .find('.form-group')
          );
        }, 80);
      }, 20);
    }
  }

  /**
   * After calling onSetTriggered this method is triggered to emit the selected tab details
   */
  setTab(tab: TabItem) {
    if (tab.visible) {
      this.selectedTab.emit(tab);
    } else {
      /**
       * here the list is restored from list to tabList
       * later we check if the deleted tab is at which index
       * if at 0th index and tabList is not empty we set the details to 1st index value
       * else we check the visible property if its true we set the previous index else we set to the
       * first visible tab as selected tab.
       */

      let isTabEmitted: boolean = false;
      if (tab.index == 0 && this.tabList.length > 0 && this.tabList[1] && this.tabList[1].visible) {
        this.tabList[1].isSelected = true;
        this.setTab(this.tabList[1]);
        isTabEmitted = true;
      } else {
        if (this.tabList[tab.index - 1] && this.tabList[tab.index - 1].visible) {
          this.tabList[tab.index - 1].isSelected = true;

          this.setTab(this.tabList[tab.index - 1]);
          isTabEmitted = true;
        } else {
          for (let tabs of this.tabList) {
            if (tabs.visible) {
              this.tabList[tabs.index].isSelected = true;

              this.setTab(this.tabList[tabs.index]);
              isTabEmitted = true;
              break;
            }
          }
        }
      }
      if (!isTabEmitted) {
        // console.log(this.tabList);
        this.selectedTab.emit(undefined);
        this.isContentDisplayed = false;
      }
    }
  }
  /**
   * this method is trigger when clicked on Add button
   */
  onAddClick(event) {
    this.onTabAdded.emit(event);
    this.isContentDisplayed = true;
  }

  /**
   * After calling onDeleteTriggered this method is triggered to emit the selected tab details
   */
  onDeleteClick(tab: TabItem) {
    this.tabList.filter((tabs) => {
      tabs.isSelected = false;
    });

    this.onTabDeleted.emit(tab);
    // console.log(tab.visible);
    if (!tab.visible) {
      this.setTab(tab);
    } else {
      // console.log(tab);
      this.tabList[tab.index].isSelected = true;
    }
  }

  /**
   * @ignore
   */
  displaySelected() {
    for (let i = 0; i < this.tabList.length; i++) {
      if (this.tabList[this.tabList.length - i] != undefined && this.tabList[this.tabList.length - i].visible) {
        this.setTab(this.tabList[this.tabList.length - i]);
        this.tabList[this.tabList.length - i].isSelected = true;
        break;
      }
    }
  }
}
