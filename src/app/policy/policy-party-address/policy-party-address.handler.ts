import { PolicyService } from './../services/policy.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FieldItem } from 'src/app/models/common/field-item';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyAddressHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  @Input() model: any;
  protected addressFieldItems: FieldItem[];

  constructor(policyService: PolicyService) {
    super(policyService);
  }
  ngOnInit() {}
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
    this.service.setModelFieldValue(item.model, 'stateCd', undefined);
    this.service.setModelFieldValue(item.model, 'cityCd', undefined);
    this.service.setModelFieldValue(item.model, 'pinCode', undefined);
  }

  public onAddressFieldsCreated(fieldItemArray: FieldItem[]) {
    this.addressFieldItems = fieldItemArray;
  }
}
