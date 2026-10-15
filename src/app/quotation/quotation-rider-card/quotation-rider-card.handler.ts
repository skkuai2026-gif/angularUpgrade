import { TabItem } from './../../models/common/tab-items';
import { Component, OnInit, OnChanges, SimpleChanges, Input, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { QuotationService } from '../services/quotation.service';
// import { DynamicComponentList } from '../services/dynamic-component-list';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationRiderCardHandlerComponent extends BaseComponent<QuotationService> implements OnChanges {
  selectedTab: TabItem;
  tabList: TabItem[];
  isEditClicked: boolean;
  selectedRider: any;

  constructor(quotationService: QuotationService) {
    super(quotationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.getRiderTabList();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['responseUpdated'] && changes['responseUpdated'].currentValue == true) {
      this.getRiderTabList();
    }
  }
  protected getRiderTabList() {
    this.tabList = [];
    let riderIndex = 0;
    let length = 0;
    this.service.responseIO.data.RiderList.forEach((rider: any) => {
      let isExist: boolean;
      isExist = false;
      if (length !== 0) {
        for (let index = 0; index < length; index++) {
          if (this.tabList[index] != undefined && this.tabList[index].id === rider.insuredPartyRefGuid) {
            isExist = true;
            break;
          }
        }
      }

      if (length == 0 || !isExist) {
        let tab = new TabItem();
        tab.id = rider.insuredPartyRefGuid;
        tab.text = rider.insuredPartyName;
        tab.index = riderIndex;
        this.tabList[riderIndex] = tab;
        if (rider.status == 'D' || rider.removed == 'YES') tab.visible = false;
        riderIndex++;
        length = this.tabList.length;
      }
      rider['errorExists'] = this.service.getErrorCount(rider);
      // if (this.selectedRider != undefined && this.selectedRider.guid == rider.guid) {
      //   this.closeModal('riderEditor');
      //   setTimeout(() => {
      //     this.onEditBtnClick(rider);
      //   }, 5);
      // }
    });
    this.tabList[0].isSelected = true;
    this.selectedTab = this.tabList[0];

    // console.log(this.tabList);
  }
  setTab(tab: TabItem) {
    this.selectedTab = tab;
  }

  onEditBtnClick(rider) {
    this.openPopup('riderEditor');
    this.selectedRider = rider;
    // this.service.loadScroll();
  }

  public onRiderChanged(fieldItem: FieldItem) {
    if (
      fieldItem.event != undefined &&
      (fieldItem.fieldCd == 'baseSumAssured' ||
        fieldItem.fieldCd == 'selected' ||
        fieldItem.fieldCd == 'productPlanOptionCd' ||
        fieldItem.fieldCd == 'premiumPayingTerm' ||
        fieldItem.fieldCd == 'modalPremium' ||
        fieldItem.fieldCd == 'productTerm')
    ) {
      this.evaluateRider(fieldItem);
    }
    setTimeout(() => {
      this.service.setFieldFocusForDisabledScroll();
    }, 150);
  }

  private evaluateRider(fieldItem: FieldItem) {
    let isMetadataHelpReqd = this.service.responseIO['isMetadataHelpReqd'];
    this.service.evaluateRider(this.selectedStep.selectedTab.modelList, fieldItem.model).subscribe(
      (body) => {
        this.service.responseIO = JSON.parse(JSON.stringify(body));
        if (isMetadataHelpReqd != undefined) this.service.responseIO['isMetadataHelpReqd'] = isMetadataHelpReqd;
        this.setCurrentRider();
        // this.getRiderTabList();
      },
      (error) => {
        console.log('Error:', error);
      }
    );
  }

  public setCurrentRider() {
    if (this.selectedRider == undefined) return;
    this.service.responseIO.data.RiderList.forEach((rider: any) => {
      if (rider.guid == this.selectedRider.guid) this.selectedRider = rider;
    });
  }

  public onRiderFocused(fieldItem: FieldItem) {
    //alert('onRiderFocused' + fieldItem.fieldCd + 'has changed');
    if (fieldItem.fieldCd == 'productPlanOptionCd') {
      //first blanking out the options since all options are visible for a fraction of second.
      this.service.setItemOptions(fieldItem, []);
      this.service.getApplicableRiderPlanOptions(fieldItem, this.service.responseIO.data.BasePlan);
    }
  }
}
