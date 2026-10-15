import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { LeadService } from '../services/lead.service';
import { LeadPartyAddressHandlerComponent } from './lead-party-address.handler';

@Component({
  selector: 'sym-lead-party-address',
  templateUrl: './lead-party-address.component.html',
  styleUrls: ['./lead-party-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyAddressComponent extends LeadPartyAddressHandlerComponent {
  @Input() model: any;

  constructor(leadService: LeadService) {
    super(leadService);
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
    if (pinCodeFieldItem != undefined) this.service.getPinCode(pinCodeFieldItem);
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
}
