import { Component, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { LeadService } from '../services/lead.service';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LeadPartyAddressHandlerComponent extends BaseComponent<LeadService> implements OnChanges {
  protected addressFieldItems: FieldItem[];
  constructor(leadService: LeadService) {
    super(leadService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
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

  protected countryCd_change(item: FieldItem) {
    // this.service.setModelFieldValue(item.model, 'stateCd', undefined);
    // this.service.setModelFieldValue(item.model, 'cityCd', undefined);
    if (item.model['pinCode'] != undefined) {
      this.service.setModelFieldValue(item.model, 'pinCode', undefined);
      this.pinCode_change(item); //triggering pinCode changes so that stateCD and cityCD should clear value
    }
  }

  public onAddressFieldsCreated(fieldItemArray: FieldItem[]) {
    this.addressFieldItems = fieldItemArray;
  }
}
