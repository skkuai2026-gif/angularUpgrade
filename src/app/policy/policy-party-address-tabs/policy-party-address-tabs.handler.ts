import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { TabItem } from 'src/app/models/common/tab-items';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyAddressTabsHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  addressTabList: TabItem[];
  selectedAddressTab: TabItem;
  responseUpdated: boolean;
  public partyModel: any;
  public model: any;
  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.loadAddressTab();
  }

  ngOnChanges(changes: SimpleChanges) {
    //model is being used in XML config
    if (this.model != undefined) {
      this.partyModel = this.model;
    }
    super.ngOnChanges(changes);
  }

  displaySelectedTabBody(tab: TabItem) {
    this.selectedAddressTab = tab;
  }

  protected getAddressTypeList(): string[] {
    let addressList = ['ResidentalAddress', 'PermanentAddress', 'OfficeAddress'];
    return addressList;
  }
  protected loadAddressTab() {
    let addressList = this.getAddressTypeList();
    this.addressTabList = [];
    addressList.filter((addressType) => {
      if (this.partyModel[addressType] != undefined) {
        let tab = new TabItem();

        tab.text = this.settingService.getLabelValue(addressType);
        tab.isSelected = false;
        tab.id = addressType;

        this.addressTabList.push(tab);
      }
    });

    if (this.addressTabList.length > 0) {
      this.addressTabList[0].isSelected = true;
      this.selectedAddressTab = null;
      this.selectedAddressTab = this.addressTabList[0];
    }
  }
}
