import { Component, Input, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from './../services/policy.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyIdentityHandlerComponent extends BaseComponent<PolicyService> {
  partyModel: any;
  model: any;
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.model != undefined) {
      this.partyModel = this.model;
    }
  }
  public onAddPartyIdentity(_event) {
    this.service.addPartyIdentity(this.partyModel);
  }
  public on_IdentityList_RowAdded(item: any) {
    this.service.addPartyIdentity(this.partyModel, item);
  }
}
