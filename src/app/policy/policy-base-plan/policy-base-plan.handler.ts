import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyBasePlanHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  constructor(policyService: PolicyService) {
    super(policyService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
