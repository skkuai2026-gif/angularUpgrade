import { Component, OnChanges, OnInit, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { FieldItem } from 'src/app/models/common/field-item';
import { BaseComponent } from 'src/app/system-common/base/base.component';
import { PolicyService } from '../services/policy.service';
import { PolicyBasePlanHandlerComponent } from './policy-base-plan.handler';

@Component({
  selector: 'sym-policy-base-plan',
  templateUrl: './policy-base-plan.component.html',
  styleUrls: ['./policy-base-plan.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyBasePlanComponent extends PolicyBasePlanHandlerComponent implements OnChanges {
  constructor(policyService: PolicyService) {
    super(policyService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
