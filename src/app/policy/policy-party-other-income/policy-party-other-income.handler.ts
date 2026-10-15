import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from './../services/policy.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyOtherIncomeHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  partyModel: any;
  model: any;
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.model != undefined) {
      this.partyModel = this.model;
    }
    super.ngOnChanges(changes);
  }
  public onAddPartyOtherIncome(event) {
    this.service.addPartyOtherIncome(this.partyModel);
  }
}
