import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-withdrawal',
  templateUrl: './policy-withdrawal.component.html',
  styleUrls: ['./policy-withdrawal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyWithdrawalComponent extends BaseComponent<PolicyService> implements OnChanges {
  constructor(policyService: PolicyService) {
    super(policyService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
  onWithdrawalChanged(item) {}
  onWithdrawalRowAdded(item) {}
}
