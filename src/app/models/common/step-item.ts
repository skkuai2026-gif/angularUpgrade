import { TabItem } from './tab-items';

export class StepItem {
  index: number;
  id: string;
  tabList: TabItem[];
  status?: string; // status can be selected/completed/pending
  buttonList: string[];
  errorCount?: number;
  validationErrors?: any;
  selectedTab?: TabItem;
  displayErrorToast?: boolean;
  isRightContentAdded?: boolean;
  isLastStep?: boolean;
  xmlDOM?: any;
  private originalButtonList?: string[];
  isSelected?: boolean;
  private visibleTabCount?: number;
  isTriggerTabChange: String;

  constructor(
    index?: number,
    id?: string,
    tabList?: TabItem[],
    buttonList?: string[],
    isSelected?: boolean
    //, status?: string, errorCount?: number, validationErrors?: any, selectedTab?: TabItem
  ) {
    this.index = index;
    this.id = id;
    this.tabList = tabList;
    this.buttonList = buttonList;
    this.isSelected = isSelected;
    this.isTriggerTabChange = new String('NO');
    this.setVisibleTabCount();
  }

  public setVisibleTabCount() {
    let applicableTabs: number = 0;
    if (this.tabList != undefined) {
      for (let i = 0; i < this.tabList.length; i++) {
        if (this.tabList[i].visible == undefined || this.tabList[i].visible) {
          applicableTabs++;
        }
      }
    }
    this.visibleTabCount = applicableTabs;
  }

  public getVisibleTabCount(): number {
    return this.visibleTabCount;
  }

  public getTabItem(tabId: string): TabItem {
    let tabItem: TabItem;
    for (let i = 0; i < this.tabList.length; i++) {
      if (this.tabList[i].id == tabId) {
        tabItem = this.tabList[i];
        break;
      }
    }
    return tabItem;
  }

  hideFowardButtons?(buttonListToHide?: string[]) {
    //copy current buttons from button list to originalButtonList
    //remove all Save, continue buttons. Object.assign([], this.buttonList

    this.originalButtonList =
      this.originalButtonList == undefined ? JSON.parse(JSON.stringify(this.buttonList)) : this.originalButtonList;
    if (this.buttonList.indexOf('but_DraftSave') > 0) {
      this.buttonList.splice(this.buttonList.indexOf('but_DraftSave'), 1);
    }
    if (this.buttonList.indexOf('but_Continue') > 0) {
      this.buttonList.splice(this.buttonList.indexOf('but_Continue'), 1);
    }
    if (this.buttonList.indexOf('but_Pay') > 0) {
      this.buttonList.splice(this.buttonList.indexOf('but_Pay'), 1);
    }
    if (buttonListToHide != undefined) {
      buttonListToHide.forEach((buttonToHide) => {
        if (this.buttonList.indexOf(buttonToHide) > 0) {
          this.buttonList.splice(this.buttonList.indexOf(buttonToHide), 1);
        }
      });
    }
  }

  hideButtons?(buttonListToHide?: string[]) {
    //copy current buttons from button list to originalButtonList
    //remove all Save, continue buttons. Object.assign([], this.buttonList

    this.originalButtonList =
      this.originalButtonList == undefined ? JSON.parse(JSON.stringify(this.buttonList)) : this.originalButtonList;

    if (buttonListToHide != undefined) {
      buttonListToHide.forEach((buttonToHide) => {
        if (this.buttonList.indexOf(buttonToHide) >= 0) {
          this.buttonList.splice(this.buttonList.indexOf(buttonToHide), 1);
        }
      });
    }
  }

  resetForwardButtons?() {
    //copy buttons back from original button list
    if (this.originalButtonList != undefined) {
      this.buttonList = [];
      this.originalButtonList.filter((button) => {
        this.buttonList.push(button);
      });
    }
  }
}
