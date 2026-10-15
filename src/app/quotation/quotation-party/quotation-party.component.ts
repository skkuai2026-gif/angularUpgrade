import { SettingService } from 'src/app/system-common/services/setting.service';
import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { QuotationService } from '../services/quotation.service';
import { QuotationPartyHandlerComponent } from './quotation-party.handler';
import { TabItem } from 'src/app/models/common/tab-items';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-quotation-party',
  templateUrl: './quotation-party.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class QuotationPartyComponent extends QuotationPartyHandlerComponent {
  @Input() public model: any;
  @Input() public contactReqd: boolean;
  csaLinkSISearchDisplayed: boolean = false;
  addressTabList: TabItem[];
  protected addressFieldItems: FieldItem[];

  selectedAddressTab: TabItem;
  constructor(quotationService: QuotationService, public settingService: SettingService) {
    super(quotationService, settingService);
    this.contactReqd = false;
  }
  public genderCd_change(item: FieldItem) {
    super.genderCd_change(item);
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  public dob_change(item: FieldItem) {
    super.dob_change(item);
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  public smoker_change() {
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  public age_change(item: FieldItem) {
    super.age_change(item);
    if (this.service.responseIO.data.WithdrawalList && this.service.responseIO.data.WithdrawalList.length > 0) {
      this.service.responseIO.data.Entity.campaignCode = 'RESET';
    }
  }
  ngOnInit() {
    super.ngOnInit();
    this.loadAddressTab();
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
    if (changes['model'] && changes['model'].currentValue) {
      this.model = this.model;
      // console.log(this.service.responseIO);
    }
    if (changes['contactReqd'] && changes['contactReqd'].currentValue) {
      if (this.contactReqd) {
        this.contactReqd = this.contactReqd;
      } else {
        this.contactReqd = false;
      }
    }
  }

  public onLinkSISearchSelected(selectedOption) {
    console.log('onlinksisearch', selectedOption['firstName1'], selectedOption['lastName1']);
    this.service.setModelFieldValue(
      this.service.responseIO.data.PrimaryInsured,
      'customerId',
      selectedOption['leadId']
    );
    this.service.setModelFieldValue(
      this.service.responseIO.data.PrimaryInsured,
      'firstname',
      selectedOption['firstName1']
    );
    this.service.setModelFieldValue(
      this.service.responseIO.data.PrimaryInsured,
      'lastname',
      selectedOption['lastName1']
    );
    this.service.setModelFieldValue(
      this.service.responseIO.data.PrimaryInsured,
      'middlename',
      selectedOption['middleName1']
    );
    this.service.setModelFieldValue(
      this.service.responseIO.data.PrimaryInsured,
      'extensionName',
      selectedOption['extensionname1']
    );

    // this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured, 'dob', selectedOption['birthDt']);
    // this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured, 'age', selectedOption['age']);
    // this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured, 'genderCd', selectedOption['genderCd']);
  }

  public linkInsured_click() {
    console.log('in linkInsirance');
    this.csaLinkSISearchDisplayed = true;
    this.openPopup('searchInsuredProposal');
  }

  displaySelectedTabBody(tab: TabItem) {
    this.selectedAddressTab = tab;
  }

  public loadAddressTab() {
    let addressList = ['ResidentalAddress', 'PermanentAddress', 'OfficeAddress'];
    this.addressTabList = [];
    addressList.filter((addressType) => {
      let tab = new TabItem();

      tab.text = this.settingService.getLabelValue(addressType);
      tab.isSelected = false;
      tab.id = addressType;

      this.addressTabList.push(tab);
    });

    if (this.addressTabList.length > 0) {
      this.addressTabList[0].isSelected = true;
      this.selectedAddressTab = null;
      this.selectedAddressTab = this.addressTabList[0];
    }
  }

  // protected addressLine1Lang1_change(item: FieldItem) {
  //   this.getStateCd(item, 'addressLine1Lang1', 'addressLine2Lang1');
  //   this.getCityCd(item, 'addressLine1Lang1', 'addressLine2Lang1', 'addressLine3Lang1');
  //   this.service.setModelFieldValue(item.model, 'addressLine2Lang1', undefined);
  //   this.service.setModelFieldValue(item.model, 'addressLine3Lang1', undefined);
  // }

  // protected addressLine2Lang1_change(item: FieldItem) {
  //   this.getCityCd(item, 'addressLine1Lang1', 'addressLine2Lang1', 'addressLine3Lang1');
  // }

  // protected coverageCountryCd_change(item: FieldItem) {
  //   this.service.setModelFieldValue(item.model, 'addressLine4', undefined);
  //   this.service.setModelFieldValue(item.model, 'coverageCityCd', undefined);
  //   this.getStateCd(item, 'coverageCountryCd', 'addressLine4');
  //   this.getCityCd(item, 'coverageCountryCd', 'addressLine4', 'coverageCityCd');
  // }
  // protected addressLine4_change(item: FieldItem) {
  //   // this.getCityCd(item, 'coverageCountryCd', 'addressLine4', 'coverageCityCd');
  // }

  // protected countryCd_change(item: FieldItem) {
  //   this.service.setModelFieldValue(item.model, 'stateCd', undefined);
  //   this.service.setModelFieldValue(item.model, 'cityCd', undefined);
  //   this.getStateCd(item, 'countryCd', 'stateCd');
  //   this.getCityCd(item, 'countryCd', 'stateCd', 'cityCd');
  // }
  // protected stateCd_change(item: FieldItem) {
  //   this.getCityCd(item, 'countryCd', 'stateCd', 'cityCd');
  // }

  // protected getStateCd(item: FieldItem, countryCdField: string, stateCdField: string) {
  //   if (this.addressFieldItems != undefined) {
  //     let stateFieldItem: FieldItem;
  //     let cityFieldItem: FieldItem;
  //     this.service.setModelFieldValue(stateFieldItem, stateCdField, null);
  //     this.addressFieldItems.filter((addressFieldItem: FieldItem) => {
  //       if (addressFieldItem.fieldCd == stateCdField) {
  //         stateFieldItem = addressFieldItem;
  //       }
  //     });

  //     if (stateFieldItem != undefined) {
  //       this.service.getStateCd(stateFieldItem, countryCdField);
  //     }
  //   }
  // }
  protected industryCd_change(item: FieldItem) {
    console.log('industry change');
    let planModel = this.service?.responseIO?.data?.BasePlan?.PlanExtraList;
    if (planModel && planModel.length > 0) {
      planModel.forEach((planExtra: any) => {
        this.service.setDeleted(planExtra);
      });
      console.log('planModel', this.service?.responseIO?.data?.BasePlan?.PlanExtraList);
    }

    let riderModel = this.service?.responseIO?.data?.RiderList;
    if (riderModel && riderModel.length > 0) {
      riderModel.forEach((rider: any) => {
        if (rider?.RiderExtraList && rider.RiderExtraList.length > 0) {
          rider.RiderExtraList.forEach((riderExtra: any) => {
            this.service.setDeleted(riderExtra);
          });
        }
      });
    }
    console.log('riderModel', this.service?.responseIO?.data?.RiderList);
  }
  // protected getCityCd(item: FieldItem, countryCdField: string, stateCdField: string, cityCdField: string) {
  //   if (this.addressFieldItems != undefined) {
  //     let stateFieldItem: FieldItem;
  //     this.addressFieldItems.filter((addressFieldItem: FieldItem) => {
  //       if (addressFieldItem.fieldCd == cityCdField) stateFieldItem = addressFieldItem;
  //     });
  //     if (stateFieldItem != undefined) {
  //       this.service.setModelFieldValue(stateFieldItem, cityCdField, null);
  //       this.service.getCityCd(stateFieldItem, countryCdField, stateCdField);
  //     }
  //   }
  // }

  public onAddressFieldsCreated(fieldItemArray: FieldItem[]) {
    this.addressFieldItems = fieldItemArray;
  }
  protected stateCd_focus(item: FieldItem) {
    this.service.getStateCd(item);
  }

  protected cityCd_focus(item: FieldItem) {
    this.service.getCityCd(item);
  }
  public educationCd_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model.OfficeAddress, 'countryCd', null);
    this.service.setModelFieldValue(item.model.OfficeAddress, 'stateCd', null);
    this.service.setModelFieldValue(item.model.OfficeAddress, 'cityCd', null);
  }
  protected occupationCd_change() {
    console.log('occupation change');
    let planModel = this.service?.responseIO?.data?.BasePlan?.PlanExtraList;
    if (planModel && planModel.length > 0) {
      planModel.forEach((planExtra: any) => {
        this.service.setDeleted(planExtra);
      });
      console.log('planModel', this.service?.responseIO?.data?.BasePlan?.PlanExtraList);
    }

    let riderModel = this.service?.responseIO?.data?.RiderList;
    if (riderModel && riderModel.length > 0) {
      riderModel.forEach((rider: any) => {
        if (rider?.RiderExtraList && rider.RiderExtraList.length > 0) {
          rider.RiderExtraList.forEach((riderExtra: any) => {
            this.service.setDeleted(riderExtra);
          });
        }
      });
    }
    console.log('riderModel', this.service?.responseIO?.data?.RiderList);
  }
}
