import { PolicyService } from './../services/policy.service';
import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { FieldItem } from 'src/app/models/common/field-item';
import { PolicyPartyAddressHandlerComponent } from './policy-party-address.handler';

@Component({
  selector: 'sym-policy-party-address',
  templateUrl: './policy-party-address.component.html',
  styleUrls: ['./policy-party-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyAddressComponent extends PolicyPartyAddressHandlerComponent implements OnChanges {
  @Input() model: any;
  @Input() modelPath: string;
  constructor(policyService: PolicyService) {
    super(policyService);
  }
  ngOnInit() {
    console.log('modelllll', this.model);
    super.ngOnInit();
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }

  protected pinCode_focus(item: FieldItem) {
    let resp = this.service.getPinCode(item);
    this.service.setItemOptions(item, resp, false);
  }

  protected pinCode_change(item: FieldItem) {
    //do nothing
  }

  protected countryCd_change(item: FieldItem) {
    console.log('country change');
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
}
