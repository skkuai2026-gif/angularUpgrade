import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyAgentSharingHandlerComponent extends BaseComponent<PolicyService> implements OnInit {
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  public onAddPolicyAgent(event) {
    this.service.addPolicyAgent();
  }

  onDeleteSelected(item) {
    this.service.setDeleted(item);
  }
}
