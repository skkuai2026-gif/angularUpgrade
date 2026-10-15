import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { TabItem } from 'src/app/models/common/tab-items';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { PolicyService } from '../services/policy.service';
import { PolicyPartyAddressTabsHandlerComponent } from './policy-party-address-tabs.handler';

@Component({
  selector: 'sym-policy-party-address-tabs',
  templateUrl: './policy-party-address-tabs.component.html',
  styleUrls: ['./policy-party-address-tabs.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyAddressTabsComponent extends PolicyPartyAddressTabsHandlerComponent implements OnChanges {
  addressTabList: TabItem[];
  selectedAddressTab: TabItem;
  @Input() partyModel: any;
  @Input() model: any;
  @Input() modelPath: any;
  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService, settingService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    this.loadAddressTab();
  }
  protected getAddressTypeList(): string[] {
    var addressList = ['ResidentalAddress', 'PermanentAddress', 'OfficeAddress'];
    if (this.partyModel.roleCd == 'PROPOSER') {
      if (this.service.responseIO.data.Proposer != undefined) {
        if (this.service.responseIO.data.Proposer.partyTypeCd == 'ORGANIZATION') {
          var addressList = ['OfficeAddress'];
        }
      }
    }
    return addressList;
  }
  protected loadAddressTab() {
    // console.log('for header')
    // if (this.service.responseIO.data.Proposer.partyTypeCd  != 'ORGANIZATION') {
    //   var addressList = ['RESIDENTIAL', 'PERMANENT', 'BUSINESS ADDRESS'];
    // }
    // if (this.service.responseIO.data.Proposer.partyTypeCd  == 'ORGANIZATION') {
    //   var addressList = ['BUSINESS ADDRESS'];
    // }
    var addressList = this.getAddressTypeList();
    this.addressTabList = [];
    addressList.filter((addressType) => {
      if (this.partyModel[addressType] != undefined) {
        let tab = new TabItem();
        if (this.partyModel.roleCd == 'PROPOSER') {
          if (this.service.responseIO.data.Proposer != undefined) {
            if (this.service.responseIO.data.Proposer.partyTypeCd == 'ORGANIZATION') {
              tab.text = 'Current Office Address';
            }
          }
        } else {
          tab.text = this.settingService.getLabelValue(addressType);
        }
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
