import { TabItem } from 'src/app/models/common/tab-items';
import { StepItem } from 'src/app/models/common/step-item';
import {
  Component,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { SettingService } from '../services/setting.service';

declare const scrollToTop: any;

@Component({
  selector: 'sym-tab-container',
  templateUrl: './tab-container.component.html',
  styleUrls: ['./tab-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class TabContainerComponent implements OnInit {
  @Input() selectedStep: StepItem;
  @Input() selectedTab: TabItem;
  @Input() isTriggerTabChange: String;
  previousTab: TabItem;
  nextTab: TabItem;

  @Input() tabNavigationOnFooter: boolean;

  @Output() tabChange = new EventEmitter<TabItem>();

  /**
   * @ignore
   */
  isPreviousRequired: boolean;
  /**
   * @ignore
   */
  isNextRequired: boolean;
  /**
   * @ignore
   */
  isTabVisible: boolean;
  constructor(public settingService: SettingService) {
    this.isPreviousRequired = false;
    this.isNextRequired = false;
    this.isTabVisible = false;
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedTab'] && changes['selectedTab'].currentValue) {
      this.setPreviousNextTab();
    }
    if (
      changes['isTriggerTabChange'] &&
      changes['isTriggerTabChange'].currentValue &&
      changes['isTriggerTabChange'].currentValue == 'YES'
    ) {
      this.setPreviousNextTab();
    }
  }

  private setPreviousNextTab() {
    for (let i = 0; i < this.selectedStep.tabList.length; i++) {
      if (
        (this.selectedStep.tabList[i].visible == undefined || this.selectedStep.tabList[i].visible) &&
        this.selectedStep.tabList.length > 1 &&
        i > 0
      ) {
        this.isTabVisible = true;
      }
    }
    /** This checks if previous or next button is to be displayed based on tabs displayed */
    if (this.isTabVisible) {
      /**
       * To display previous button based on it's visible property
       */
      this.setPreviousTabOrVisibility(true);
      /**
       * To display next button based on it's visible property
       */
      this.setNextTabOrVisibility(true);
    }
  }

  /**
   * To display previous button to navigate through tabs if it as a tab before it,
   * @param tabVisibility if set to boolean value 'true' indicates that
   *  the property is set for button visibility,
   * if set to boolean value 'false' then
   * it emits the previous tab from the selected tab based on it's visible property
   */
  setPreviousTabOrVisibility(tabVisibility: boolean) {
    let lastIndex = 1;
    for (let i = 0; i < this.selectedStep.tabList.length; i++) {
      if (this.selectedStep.tabList[i].id === this.selectedTab.id) {
        scrollToTop();
        lastIndex = this.getIndexForPreviousTabsVisibility(i, lastIndex);
        if (
          i - lastIndex > -1 &&
          i - lastIndex < i &&
          this.selectedStep.tabList[i - lastIndex] != undefined &&
          (this.selectedStep.tabList[i - lastIndex].visible == undefined ||
            this.selectedStep.tabList[i - lastIndex].visible)
        ) {
          if (!tabVisibility) {
            this.tabChange.emit(this.selectedStep.tabList[i - lastIndex]);
          } else {
            this.isPreviousRequired = true;
            this.previousTab = this.selectedStep.tabList[i - lastIndex];
          }
        } else {
          this.isPreviousRequired = false;
        }
        break;
      }
    }
  }

  /**
   *To display Next button to navigate through tabs if it has a tab next to it,
   * @param tabVisibility if set to boolean value 'true' indicates that
   * the property is set for button visibility,
   * if set to boolean value 'false' then
   * it emits the Next tab from the selected tab based on it's visible property
   */

  setNextTabOrVisibility(tabVisibility: boolean) {
    let lastIndex = 1;
    for (let i = 0; i < this.selectedStep.tabList.length; i++) {
      if (this.selectedStep.tabList[i].id === this.selectedTab.id) {
        scrollToTop();
        lastIndex = this.getIndexForNextTabsVisibility(i, lastIndex);
        if (
          i + lastIndex > i &&
          i + lastIndex < this.selectedStep.tabList.length &&
          this.selectedStep.tabList[i + lastIndex] != undefined &&
          (this.selectedStep.tabList[i + lastIndex].visible == undefined ||
            this.selectedStep.tabList[i + lastIndex].visible)
        ) {
          if (!tabVisibility) {
            this.tabChange.emit(this.selectedStep.tabList[i + lastIndex]);
          } else {
            this.isNextRequired = true;
            this.nextTab = this.selectedStep.tabList[i + lastIndex];
          }
        } else {
          this.isNextRequired = false;
        }
        break;
      }
    }
  }

  /**
   * @ignore
   * This method returns the index of visible tab based on it's visible property
   * @param i indicates index from the loop called
   * @param lastIndex indicates the next visible index, usually starts from value 1
   * @returns lastIndex value based on visible property
   */
  private getIndexForPreviousTabsVisibility(i: number, lastIndex: number): number {
    let visible =
      this.selectedStep.tabList[i - lastIndex] != undefined &&
      (this.selectedStep.tabList[i - lastIndex].visible == undefined ||
        this.selectedStep.tabList[i - lastIndex].visible)
        ? true
        : false;
    if (!visible) {
      for (let j = i; j > -1; j--) {
        visible =
          this.selectedStep.tabList[i - lastIndex] != undefined &&
          (this.selectedStep.tabList[i - lastIndex].visible == undefined ||
            this.selectedStep.tabList[i - lastIndex].visible)
            ? true
            : false;

        if (j - lastIndex > -1 && j - lastIndex < j && !visible) {
          lastIndex++;
        }
        if (visible) {
          break;
        }
      }
    }
    return lastIndex;
  }

  /**
   * @ignore
   * This method returns the index of visible tab based on it's visible property
   * @param i indicates index from the loop called
   * @param lastIndex indicates the next visible index, usually starts from value 1
   * @returns lastIndex value based on visible property
   */
  private getIndexForNextTabsVisibility(i: number, lastIndex: number): number {
    let visible =
      this.selectedStep.tabList[i + lastIndex] != undefined &&
      (this.selectedStep.tabList[i + lastIndex].visible == undefined ||
        this.selectedStep.tabList[i + lastIndex].visible)
        ? true
        : false;
    if (!visible) {
      for (let j = i; j < this.selectedStep.tabList.length; j++) {
        visible =
          this.selectedStep.tabList[i + lastIndex] != undefined &&
          (this.selectedStep.tabList[i + lastIndex].visible == undefined ||
            this.selectedStep.tabList[i + lastIndex].visible)
            ? true
            : false;
        if (i + lastIndex > i && i + lastIndex < this.selectedStep.tabList.length && !visible) {
          lastIndex++;
        }
        if (visible) {
          break;
        }
      }
    }

    return lastIndex;
  }
}
