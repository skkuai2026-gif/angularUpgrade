import { Component, Input, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FieldItem } from 'src/app/models/common/field-item';
import { SettingService } from 'src/app/system-common/services/setting.service';

@Component({
  selector: 'sym-policy-mailing-addr-contact',
  templateUrl: './policy-mailing-addr-contact.component.html',
  styleUrls: ['./policy-mailing-addr-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyMailingAddrContactComponent extends BaseComponent<PolicyService> implements OnChanges {
  @Input() model: any;
  @Input() partyModel: string;
  protected addressFieldItems: FieldItem[];

  constructor(policyService: PolicyService, settingservice: SettingService) {
    super(policyService);
  }
  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  protected countryCd_change(item: FieldItem) {
    console.log('item model' + item.model.countryCd);
    this.service.setModelFieldValue(item.model, 'stateCd', undefined);
    this.service.setModelFieldValue(item.model, 'cityCd', undefined);
    this.service.setModelFieldValue(item.model, 'pinCode', undefined);
    let pinCodeFieldItem: FieldItem;
    this.addressFieldItems.filter((addressFieldItem: FieldItem) => {
      if (addressFieldItem.fieldCd == 'pinCode') pinCodeFieldItem = addressFieldItem;
    });
    // if (pinCodeFieldItem != undefined) this.service.getPinCode(pinCodeFieldItem);
    // this.service.setModelFieldValue(item.model, 'stateCd', undefined);
    // this.service.setModelFieldValue(item.model, 'cityCd', undefined);
    console.log('30' + item.model['pinCode']);
    // if (item.model['pinCode'] != undefined) {
    console.log('item after pinCode is set' + item);
    //   this.service.setModelFieldValue(item.model, 'pinCode', undefined);
    this.pinCode_change(item); //triggering pinCode changes so that stateCD and cityCD should clear value
    // }
  }

  protected stateCd_change(item: FieldItem) {
    console.log('statecd change call');
    if (this.addressFieldItems != undefined) {
      // let stateFieldItem: FieldItem;
      let cityFieldItem: FieldItem;
      this.addressFieldItems.filter((addressFieldItem: FieldItem) => {
        if (addressFieldItem.fieldCd == 'cityCd') cityFieldItem = addressFieldItem;
      });
      console.log('in 46');
      // if (stateFieldItem != undefined) this.service.getStateCd(stateFieldItem);
      if (cityFieldItem != undefined) this.service.getCityCd(cityFieldItem);
    }
  }

  public onAddressFieldsCreated(fieldItemArray: FieldItem[]) {
    this.addressFieldItems = fieldItemArray;
  }

  protected pinCode_change(item: FieldItem) {
    //this.setFieldFocus(item.model, 'stateCd');
    if (this.addressFieldItems != undefined) {
      let stateFieldItem: FieldItem;
      let cityFieldItem: FieldItem;
      this.addressFieldItems.filter((addressFieldItem: FieldItem) => {
        if (addressFieldItem.fieldCd == 'stateCd') stateFieldItem = addressFieldItem;
        else if (addressFieldItem.fieldCd == 'cityCd') cityFieldItem = addressFieldItem;
      });
      if (stateFieldItem != undefined) this.service.getStateCd(stateFieldItem);
      if (cityFieldItem != undefined) this.service.getCityCd(cityFieldItem);
    }
  }
}
