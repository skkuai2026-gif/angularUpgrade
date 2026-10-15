import { SettingService } from './../../system-common/services/setting.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from './../services/policy.service';
import { FieldItem } from 'src/app/models/common/field-item';

@Component({
  selector: 'sym-policy-party-contact',
  templateUrl: './policy-party-contact.component.html',
  styleUrls: ['./policy-party-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyContactComponent extends BaseComponent<PolicyService> implements OnChanges {
  @Input() model: any;
  constructor(policyService: PolicyService, public settingService: SettingService) {
    super(policyService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  extensionNum_focus(item: FieldItem) {
    this.service.getCountryExtensionNum(item);
  }
  protected pinCode_focus(item: FieldItem) {
    let resp = this.service.getPinCode(item);
    this.service.setItemOptions(item, resp, false);
  }
  // protected pinCode_change(item: FieldItem) {
  //   this.service.setModelFieldValue(item.model, 'cityCd', null);
  //   this.service.setModelFieldValue(item.model, 'stateCd', null);
  // }

  protected countryCd_change(item: FieldItem) {
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
  protected field26_change() {
    this.service.setModelFieldValue(
      this.service.responseIO.data.PrimaryInsured.ResidentalContact,
      'countryCd',
      null
    );
    this.service.setModelFieldValue(
      this.service.responseIO.data.PrimaryInsured.ResidentalContact,
      'extensionNum',
      null
    );
    this.service.setModelFieldValue(
      this.service.responseIO.data.PrimaryInsured.ResidentalContact,
      'contactNum',
      null
    );
  }

  protected field27_change() {
    this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured.OfficeContact, 'countryCd', null);
    this.service.setModelFieldValue(
      this.service.responseIO.data.PrimaryInsured.OfficeContact,
      'extensionNum',
      null
    );
    this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured.OfficeContact, 'contactNum', null);
  }

  protected field28_change() {
    this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured.MobileContact, 'countryCd', null);
    this.service.setModelFieldValue(this.service.responseIO.data.PrimaryInsured.MobileContact, 'contactNum', null);
  }
}
