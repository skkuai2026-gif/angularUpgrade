import { Component, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';

@Component({
  selector: 'sym-policy-plan-extra-list',
  templateUrl: './policy-plan-extra-list.component.html',
  styleUrls: ['./policy-plan-extra-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPlanExtraListComponent extends BaseComponent<PolicyService> implements OnInit {
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnInit() {}
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
