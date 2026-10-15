import { TabItem } from './../../models/common/tab-items';
import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RiderHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  selectedIndex;
  displayRiderExtraList: boolean;
  partyTabList: TabItem[];
  selectedPartyTab: TabItem;
  isMoreRequired: boolean;
  constructor(quotationService: QuotationService) {
    super(quotationService);
    this.displayRiderExtraList = false;
    this.isMoreRequired = false;
  }

  ngOnInit() {
    this.loadPartyRiderTab();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['responseUpdated'] && changes['responseUpdated'].currentValue == true) {
      this.loadPartyRiderTab();
    }
  }

  public setSelectedIndexOfRider(index) {
    this.selectedIndex = index;
    this.displayRiderExtraList = true;
  }
  public closeRiderExtraList() {
    this.displayRiderExtraList = false;
    this.selectedIndex = undefined;
  }

  public onRiderChanged(fieldItem: FieldItem) {
    //alert('onRiderChanged' + fieldItem.fieldCd + 'has changed');
    if (
      fieldItem.fieldCd == 'baseSumAssured' ||
      fieldItem.fieldCd == 'selected' ||
      fieldItem.fieldCd == 'productPlanOptionCd' ||
      fieldItem.fieldCd == 'premiumPayingTerm' ||
      fieldItem.fieldCd == 'modalPremium' ||
      fieldItem.fieldCd == 'productTerm' ||
      fieldItem.fieldCd == 'productLongName'
    ) {
      this.evaluateRider(fieldItem);
    }
  }

  private evaluateRider(fieldItem: FieldItem) {
    if (this.service.responseIO.data['RiderPartyGuids'] != undefined)
      delete this.service.responseIO.data['RiderPartyGuids'];
    let isMetadataHelpReqd = this.service.responseIO['isMetadataHelpReqd'];
    let validationerrorsList = this.service.responseIO.validationerrors;
    this.service.evaluateRider(this.selectedStep.selectedTab.modelList, fieldItem.model).subscribe(
      (body) => {
        this.service.responseIO = JSON.parse(JSON.stringify(body));
        //in case of rider selection,validation should not display.so attach existing validation list
        if (fieldItem.fieldCd == 'selected' && fieldItem.model['selected'] == 'YES')
          this.service.responseIO.validationerrors = validationerrorsList;
        if (isMetadataHelpReqd != undefined) this.service.responseIO['isMetadataHelpReqd'] = isMetadataHelpReqd;
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
  }

  private loadPartyRiderTab() {
    if (
      this.service.responseIO.data.RiderList != undefined &&
      this.service.responseIO.data.RiderList.length != 0
    ) {
      this.partyTabList = [];
      if (this.service.responseIO.data['RiderPartyGuids'] == undefined)
        this.service.responseIO.data['RiderPartyGuids'] = {};
      this.service.responseIO.data.RiderList.filter((rider) => {
        if (this.service.responseIO.data['RiderPartyGuids'][rider.insuredPartyRefGuid] != undefined) {
          // use refGuid instead of name
          this.service.responseIO.data['RiderPartyGuids'][rider.insuredPartyRefGuid].push(rider);
        } else {
          this.service.responseIO.data['RiderPartyGuids'][rider.insuredPartyRefGuid] = [];
          let tab = new TabItem();
          tab.text = rider.insuredPartyName;
          tab.isSelected = false;
          tab.id = rider.insuredPartyRefGuid;

          this.partyTabList.push(tab);
          this.service.responseIO.data['RiderPartyGuids'][rider.insuredPartyRefGuid].push(rider);
        }
        if (rider.RiderExtraList != null && rider.RiderExtraList.length > 0) this.isMoreRequired = true;
      });

      if (this.selectedPartyTab == undefined && this.selectedPartyTab == null) {
        this.partyTabList[0].isSelected = true;
        this.selectedPartyTab = new TabItem();
        this.selectedPartyTab = this.partyTabList[0];
      } else {
        // console.log(this.selectedPartyTab);
        for (let i = 0; i < this.partyTabList.length; i++) {
          if (this.partyTabList[i].id == this.selectedPartyTab.id) {
            this.partyTabList[i].isSelected = true;
            break;
          }
        }

        this.selectedPartyTab.isSelected = true;
      }

      // console.log(this.selectedPartyTab.id);
      // console.log(this.service.responseIO);
    }
  }

  displaySelectedTabBody(tab: TabItem) {
    this.selectedPartyTab = tab;
  }
}
