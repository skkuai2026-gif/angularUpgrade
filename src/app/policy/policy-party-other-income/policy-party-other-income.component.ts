import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from './../services/policy.service';
import { PolicyPartyOtherIncomeHandlerComponent } from './policy-party-other-income.handler';
@Component({
  selector: 'sym-policy-party-other-income',
  templateUrl: './policy-party-other-income.component.html',
  styleUrls: ['./policy-party-other-income.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyOtherIncomeComponent extends PolicyPartyOtherIncomeHandlerComponent implements OnChanges {
  @Input() partyModel: any;
  @Input() model: any;
  constructor(policyService: PolicyService) {
    super(policyService);
  }

  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
