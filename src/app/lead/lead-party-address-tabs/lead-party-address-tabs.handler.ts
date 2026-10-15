import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { TabItem } from 'src/app/models/common/tab-items';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { LeadService } from '../services/lead.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyAddressTabsHandlerComponent extends BaseComponent<LeadService> implements OnChanges {
  public partyModel: any;
  addressTabList: TabItem[];
  selectedAddressTab: TabItem;
  public model: any;
  constructor(leadService: LeadService, public settingService: SettingService) {
    super(leadService);
    //console.log(this.service.responseIO);
  }

  ngOnInit() {
    this.loadAddressTab();
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.model != undefined) {
      this.partyModel = this.model;
    }
    super.ngOnChanges(changes);
  }

  displaySelectedTabBody(tab: TabItem) {
    this.selectedAddressTab = tab;
  }

  public loadAddressTab() {
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

  protected getAddressTypeList(): string[] {
    let addressList = ['ResidentalAddress', 'PermanentAddress', 'OfficeAddress'];
    return addressList;
  }
}
