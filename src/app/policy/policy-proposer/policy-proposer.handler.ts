import { Component, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { StepItem } from 'src/app/models/common/step-item';
@Component({
  selector: '',
  template: '',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyProposerHandlerComponent extends BaseComponent<PolicyService> implements OnChanges {
  constructor(policyService: PolicyService) {
    super(policyService);
    // console.log(this.selectedSubStep);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
