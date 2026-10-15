import { TabItem } from 'src/app/models/common/tab-items';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { StepItem } from './../../models/common/step-item';

import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Injectable,
  ChangeDetectionStrategy,
} from '@angular/core';

const contentDynamicHeightList = ['panel_left', 'rightSideContent'];
declare const setPageContentDynamicHeight: any;
// declare const setDefaultFocus: any;
declare const initTooltip: any;
declare const setScrollAndScreenHeight: any;
declare const scrollToTop: any;
export let activeStepComponent: StepComponent;
// @Injectable({
//   providedIn: 'root',
// })
@Component({
  selector: 'sym-step',
  templateUrl: './step.component.html',
  styleUrls: ['./step.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class StepComponent implements OnInit {
  /**
   * Indiviaual step JSON object is expected
   * e.g: your details
   */
  @Input() stepItem: StepItem;

  /**
   * This used for css toggle. To display the right side pane or not.
   * default is false
   */
  @Input() contentExcludRightTab: boolean = false;

  @Input() tabNavigationOnFooter: boolean;

  /**
   * This is triggered when any action button is clicked e.g: 'Back', 'Continue',
   */
  @Output() actionClick = new EventEmitter<string>();

  /**
   * Internal tab change is when triggered then this emitts the selected tab-item.
   */
  @Output() tabChange = new EventEmitter<TabItem>();
  /**
   * @ignore
   */
  isLeftPanelVisible: boolean;
  constructor(public settingService: SettingService) {
    this.isLeftPanelVisible = false;
    activeStepComponent = this;
  }

  ngOnInit() {
    //console.log(this.stepItem.selectedTab);
    if (this.tabNavigationOnFooter == undefined) {
      this.tabNavigationOnFooter =
        SettingService.getApplicationPropertiesValue('TABNAVIGATIONONFOOTER') == 'YES' &&
        !this.settingService.isMobileViewRendered()
          ? true
          : false;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['stepItem'] && changes['stepItem'].currentValue) {
      // console.log(this.stepItem)
      setTimeout(() => {
        setPageContentDynamicHeight(contentDynamicHeightList);
        setTimeout(() => {
          // this.settingService.loadScroll();
          this.settingService.setDefaultFocus();
          initTooltip();
        }, 20);
        $('.panel_left').removeClass('active');
      }, 10);
      let applicableTabs: number = 0;
      for (let i = 0; i < this.stepItem.tabList.length; i++) {
        if (this.stepItem.tabList[i].visible == undefined || this.stepItem.tabList[i].visible) {
          applicableTabs++;
        }
      }
      if (applicableTabs > 1) this.isLeftPanelVisible = true;
      else this.isLeftPanelVisible = false;

      setScrollAndScreenHeight();
    }
  }

  /**
   * This is triggered when any button is clicked.
   * @param buttonId button id selected
   */
  public onActionClick(buttonId: string) {
    //console.log(buttonId)
    this.settingService.buttonid = buttonId;
    this.actionClick.emit(buttonId);
  }

  /**
   * This is triggered when internal tab is selected.
   * @param tabItem Selected Tab Item is passed.
   */
  public onTabChange(tabItem: TabItem) {
    //console.log(buttonId)
    this.tabChange.emit(tabItem);
    setTimeout(() => {
      setTimeout(() => {
        setPageContentDynamicHeight(contentDynamicHeightList);
        $('.panel_left').removeClass('active');
        scrollToTop();
      }, 10);
    }, 25);
  }
}
