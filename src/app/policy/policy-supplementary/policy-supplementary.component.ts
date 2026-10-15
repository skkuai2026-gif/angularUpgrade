import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { TabItem } from 'src/app/models/common/tab-items';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
@Component({
  selector: 'sym-policy-supplementary',
  templateUrl: './policy-supplementary.component.html',
  styleUrls: ['./policy-supplementary.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicySupplementaryComponent extends BaseComponent<PolicyService> implements OnChanges {
  constructor(policyService: PolicyService) {
    super(policyService);
  }
  selectedTab: TabItem;
  tabList: TabItem[];

  ngOnInit() {
    this.initTabList();
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['responseUpdated'] && changes['responseUpdated'].currentValue) {
      if (changes['responseUpdated'].currentValue) {
        this.initTabList();
      }
    }
  }

  initTabList() {
    this.tabList = [];
    this.tabList = this.getTabList();
    if (this.tabList[0] != undefined) {
      this.selectedTab = this.tabList[0];
      this.tabList[0].isSelected = true;
    }
  }

  protected getTabList(): TabItem[] {
    let tabList: TabItem[] = [];
    let suppIndex = 0;
    let tabIndex = 0;
    this.service.responseIO.data.SupplementaryList.forEach((supplementaryParty) => {
      let tab = new TabItem();
      tab.id = 'supplementary_' + suppIndex;
      tab.text = 'Supplementary ' + (suppIndex + 1);
      tabList[tabIndex] = tab;
      tab.index = tabIndex;
      tabIndex++;

      suppIndex++;
    });
    return tabList;
  }
  setTab(tab: TabItem) {
    this.selectedTab = tab;
  }
}
