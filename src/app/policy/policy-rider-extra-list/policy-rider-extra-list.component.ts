import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from '../services/policy.service';
import { PolicyRiderExtraListHandlerComponent } from './policy-rider-extra-list.handler';

@Component({
  selector: 'sym-policy-rider-extra-list',
  templateUrl: './policy-rider-extra-list.component.html',
  styleUrls: ['./policy-rider-extra-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyRiderExtraListComponent extends PolicyRiderExtraListHandlerComponent {
  @Input() model: any;
  constructor(policyService: PolicyService) {
    super(policyService);
  }
}
