import { TabItem } from 'src/app/models/common/tab-items';
import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { PolicyBeneficiaryHandlerComponent } from './policy-beneficiary.handler';
import { SettingService } from 'src/app/system-common/services/setting.service';
import { FieldItem } from 'src/app/models/common/field-item';
import { event } from 'jquery';
@Component({
  selector: 'sym-policy-beneficiary',
  templateUrl: './policy-beneficiary.component.html',
  styleUrls: ['./policy-beneficiary.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyBeneficiaryComponent extends PolicyBeneficiaryHandlerComponent implements OnChanges {
  @Input() responseUpdated: boolean;
  selectedTab: TabItem;
  tabList: TabItem[];
  respPartyRoleList: any;

  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
    // console.log(this.service.responseIO);
  }
  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  public partySameAsCd_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model, 'nomineeTypeCd', null);
    this.service.setModelFieldValue(item.model, 'quotPartyAddtnField3', null);
    this.service.setModelFieldValue(item.model, 'birthDt', null);
    this.service.setModelFieldValue(item.model, 'age', null);
    this.service.setModelFieldValue(item.model, 'relationCd', null);
    for (let i = 0; i < item.model.AdditionalFieldsList.length; i++) {
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field7', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field8', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field9', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field26', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field27', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field28', null);
    }
    this.service.setModelFieldValue(item.model, 'genderCd', null);
    this.service.setModelFieldValue(item.model, 'countryOfBirth', null);
    this.service.setModelFieldValue(item.model, 'irrevocableFl', null);
    this.service.setModelFieldValue(item.model, 'percentage', null);
    this.service.setModelFieldValue(item.model, 'copyFromAddr2', null);
    this.service.setModelFieldValue(item.model, 'quotPartyAddtnField1', null);
    this.service.setModelFieldValue(item.model, 'field27', null);
    this.service.setModelFieldValue(item.model, 'copyFromAddr3', null);
    this.service.setModelFieldValue(item.model, 'eventTypeCd', null);
    this.service.setModelFieldValue(item.model, 'quotPartyAddtnField2', null);
  }
  public field26_change(item: FieldItem) {
    if (
      this.service.responseIO.data['NomineeList'] != undefined &&
      this.service.responseIO.data['NomineeList'] != null &&
      this.service.responseIO.data['NomineeList'].length > 0
    ) {
      this.service.responseIO.data['NomineeList'].filter((nominee) => {
        if (
          nominee.AdditionalFieldsList &&
          nominee.AdditionalFieldsList.length > 0 &&
          nominee.AdditionalFieldsList[0].guid == item.model.guid
        ) {
          this.service.setModelFieldValue(nominee.ResidentalContact, 'contactNum', null);
          this.service.setModelFieldValue(nominee.ResidentalContact, 'countryCd', null);
          this.service.setModelFieldValue(nominee.ResidentalContact, 'extensionNum', null);
        }
      });
    }
  }
  public field27_change(item: FieldItem) {
    if (
      this.service.responseIO.data['NomineeList'] != undefined &&
      this.service.responseIO.data['NomineeList'] != null &&
      this.service.responseIO.data['NomineeList'].length > 0
    ) {
      this.service.responseIO.data['NomineeList'].filter((nominee) => {
        if (
          nominee.AdditionalFieldsList &&
          nominee.AdditionalFieldsList.length > 0 &&
          nominee.AdditionalFieldsList[0].guid == item.model.guid
        ) {
          this.service.setModelFieldValue(nominee.OfficeContact, 'contactNum', null);
          this.service.setModelFieldValue(nominee.OfficeContact, 'countryCd', null);
          this.service.setModelFieldValue(nominee.OfficeContact, 'extensionNum', null);
        }
      });
    }
  }
  public field28_change(item: FieldItem) {
    if (
      this.service.responseIO.data['NomineeList'] != undefined &&
      this.service.responseIO.data['NomineeList'] != null &&
      this.service.responseIO.data['NomineeList'].length > 0
    ) {
      this.service.responseIO.data['NomineeList'].filter((nominee) => {
        if (
          nominee.AdditionalFieldsList &&
          nominee.AdditionalFieldsList.length > 0 &&
          nominee.AdditionalFieldsList[0].guid == item.model.guid
        ) {
          this.service.setModelFieldValue(nominee.MobileContact, 'contactNum', null);
          this.service.setModelFieldValue(nominee.MobileContact, 'countryCd', null);
        }
      });
    }
  }
  public copyFromAddr2_change(item: FieldItem) {
    if (
      this.service.responseIO.data['NomineeList'] != undefined &&
      this.service.responseIO.data['NomineeList'] != null &&
      this.service.responseIO.data['NomineeList'].length > 0
    ) {
      this.service.responseIO.data['NomineeList'].filter((nominee) => {
        if (nominee.guid == item.model.guid) {
          this.service.setModelFieldValue(nominee.PermanentAddress, 'addressLine1Lang1', null);
          this.service.setModelFieldValue(nominee.PermanentAddress, 'countryCd', null);
          this.service.setModelFieldValue(nominee.PermanentAddress, 'addressLine2Lang1', null);
          this.service.setModelFieldValue(nominee.PermanentAddress, 'stateCd', null);
          this.service.setModelFieldValue(nominee.PermanentAddress, 'addressLine3Lang1', null);
          this.service.setModelFieldValue(nominee.PermanentAddress, 'cityCd', null);
          this.service.setModelFieldValue(nominee.PermanentAddress, 'pinCode', null);
        }
      });
    }
  }
  public eventTypeCd_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model, 'nomineeTypeCd', null);
    this.service.setModelFieldValue(item.model, 'quotPartyAddtnField3', null);
    this.service.setModelFieldValue(item.model, 'birthDt', null);
    this.service.setModelFieldValue(item.model, 'age', null);
    this.service.setModelFieldValue(item.model, 'relationCd', null);
    this.service.setModelFieldValue(item.model, 'contactNum', null);
    this.service.setModelFieldValue(item.model, 'countryCd', null);
    this.service.setModelFieldValue(item.model, 'extensionNum', null);
    this.service.setModelFieldValue(item.model, 'copyFromAddr2', null);
    for (let i = 0; i < item.model.AdditionalFieldsList.length; i++) {
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field7', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field8', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field9', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field26', null);
      // this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field27', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field28', null);
    }
    this.service.setModelFieldValue(item.model, 'quotPartyAddtnField2', null);
  }

  public nomineeTypeCd_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model, 'quotPartyAddtnField3', null);
    this.service.setModelFieldValue(item.model, 'birthDt', null);
    this.service.setModelFieldValue(item.model, 'age', null);
    this.service.setModelFieldValue(item.model, 'relationCd', null);
    for (let i = 0; i < item.model.AdditionalFieldsList.length; i++) {
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field7', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field8', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field9', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field26', null);
      this.service.setModelFieldValue(item.model.AdditionalFieldsList[i], 'field28', null);
    }
    this.service.setModelFieldValue(item.model, 'genderCd', null);
    this.service.setModelFieldValue(item.model, 'countryOfBirth', null);
    this.service.setModelFieldValue(item.model, 'irrevocableFl', null);
    this.service.setModelFieldValue(item.model, 'percentage', null);
    this.service.setModelFieldValue(item.model, 'copyFromAddr2', null);
    this.service.setModelFieldValue(item.model, 'quotPartyAddtnField1', null);
    this.service.setModelFieldValue(item.model, 'field27', null);
    this.service.setModelFieldValue(item.model, 'copyFromAddr3', null);
    this.service.setModelFieldValue(item.model, 'quotPartyAddtnField2', null);
  }

  protected pinCode_focus(item: FieldItem) {
    let resp = this.service.getPinCode(item);
    this.service.setItemOptions(item, resp, false);
  }

  protected countryCd_change(item: FieldItem) {
    console.log('country change');
    this.service.setModelFieldValue(item.model, 'extensionNum', undefined);
    this.service.setModelFieldValue(item.model, 'cityCd', null);
    this.service.setModelFieldValue(item.model, 'stateCd', null);
    this.service.setModelFieldValue(item.model, 'pinCode', null);
  }

  protected stateCd_change(item: FieldItem) {
    this.service.setModelFieldValue(item.model, 'cityCd', null);
  }

  protected stateCd_focus(item: FieldItem) {
    this.service.getStateCd(item);
  }

  protected cityCd_focus(item: FieldItem) {
    this.service.getCityCd(item);
  }
  protected quotPartyAddtnField1_change(item: FieldItem) {
    console.log('itemmmmmm:', item);
    const inputEle = item.fieldValue;
    console.log('itemmmmmm:', inputEle);

    const dynamicValue = document.getElementById('dynamic_value');
    if (dynamicValue) {
      const valueNode = document.createTextNode(inputEle);
      // dynamicValue.parentNode.insertBefore( valueNode, dynamicValue );
      $(document).ready(function () {
        const innerText = $('#dynamic_value .label').text();
        console.log(innerText);
        $('#dynamic_value .label').text(valueNode.data + ',' + innerText);
      });
    }
  }

  protected birthDt_change(item: FieldItem) {
    item.model.age = undefined;
    this.service.computeAge(item.model);
  }

  extensionNum_focus(item: FieldItem) {
    this.service.getCountryExtensionNum(item);
  }
}
