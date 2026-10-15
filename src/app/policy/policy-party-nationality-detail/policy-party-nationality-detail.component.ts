import { Component, OnInit, Input, SimpleChanges, OnChanges, ChangeDetectionStrategy } from '@angular/core';
import { PolicyService } from './../services/policy.service';
import { PolicyPartyNationalityDetailHandlerComponent } from './policy-party-nationality-detail.handler';
@Component({
  selector: 'sym-policy-party-nationality-detail',
  templateUrl: './policy-party-nationality-detail.component.html',
  styleUrls: ['./policy-party-nationality-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class PolicyPartyNationalityDetailComponent
  extends PolicyPartyNationalityDetailHandlerComponent
  implements OnChanges
{
  @Input() model: any;
  constructor(policyService: PolicyService) {
    super(policyService);
  }
  ngOnChanges(changes: SimpleChanges) {
    super.ngOnChanges(changes);
  }
}
