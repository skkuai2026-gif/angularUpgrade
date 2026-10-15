import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { TabItem } from '../../models/common/tab-items';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyRiderHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  selectedIndex;
  partyTabList: TabItem[];
  selectedPartyTab: TabItem;
  selectedRider: any;
  partyWiseRiderMap = new Map<string, any[]>();
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnInit() {
    this.loadPartyRiderTab();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (
      (changes['responseUpdated'] && changes['responseUpdated'].currentValue) ||
      (changes['responseIO'] && changes['responseIO'].currentValue && !changes['responseIO'].firstChange)
    ) {
      this.loadPartyRiderTab();
    }
  }
  public setSelectedIndexOfRider(index) {
    this.selectedIndex = index;
    //this.displayRiderExtraList = true;
    this.selectedRider = this.partyWiseRiderMap.get(this.selectedPartyTab.id)[this.selectedIndex];
  }
  public closeRiderExtraList() {
    this.selectedIndex = undefined;
    this.selectedRider = undefined;
  }

  public onRiderChanged(fieldItem: FieldItem) {
    //alert('onRiderChanged' + fieldItem.fieldCd + 'has changed');
    if (fieldItem.fieldCd == 'baseSumAssured' || fieldItem.fieldCd == 'selected') {
      this.evaluateRider(fieldItem);
    }
  }

  private evaluateRider(fieldItem: FieldItem) {
    this.service.evaluateRider(fieldItem.model).subscribe(
      (body) => {
        this.service.responseIO = JSON.parse(JSON.stringify(body));
        this.loadPartyRiderTab();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  public onRiderFocused(fieldItem: FieldItem) {
    //alert('onRiderFocused' + fieldItem.fieldCd + 'has changed');
    if (fieldItem.fieldCd == 'productPlanOptionCd') {
      this.service.getApplicableRiderPlanOptions(fieldItem, this.service.responseIO.data.BasePlan);
    }
  }

  public setSelectedTab(tab: TabItem) {
    this.selectedPartyTab = tab;
    this.closeRiderExtraList();
  }

  private loadPartyRiderTab() {
    this.partyWiseRiderMap = new Map<string, any[]>();
    if (
      this.service.responseIO.data.RiderList != undefined &&
      this.service.responseIO.data.RiderList.length != 0
    ) {
      this.partyTabList = [];
      this.service.responseIO.data.RiderList.filter((rider) => {
        if (this.partyWiseRiderMap.get(rider.insuredPartyRefGuid) != undefined) {
          let riderList = this.partyWiseRiderMap.get(rider.insuredPartyRefGuid);
          riderList[riderList.length] = rider;
          this.partyWiseRiderMap.set(rider.insuredPartyRefGuid, riderList);
        } else {
          let riderList = [rider];
          this.partyWiseRiderMap.set(rider.insuredPartyRefGuid, riderList);
          let tab = new TabItem();
          tab.text = rider.insuredPartyName;
          tab.isSelected = false;
          tab.id = rider.insuredPartyRefGuid;
          this.partyTabList.push(tab);
        }
      });
      if (this.partyTabList.length > 0) {
        this.partyTabList[0].isSelected = true;
        this.selectedPartyTab = new TabItem();
        this.selectedPartyTab = this.partyTabList[0];
      }
    }
  }
}
